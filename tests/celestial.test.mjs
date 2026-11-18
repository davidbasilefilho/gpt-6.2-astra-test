import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

import { celestialPlacement, celestialDepth } from '../src/design/celestial-geometry.js';

test('celestial island renders five genuine Base UI triggers across four entities', () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const html = execFileSync(
    `${root}node_modules/.bin/bun`,
    [
      '-e',
      `
    import { renderToStaticMarkup } from 'react-dom/server';
    import { createElement } from 'react';
    import { CelestialPlateControls } from './src/design/celestial.tsx';
    console.log(renderToStaticMarkup(createElement(CelestialPlateControls)));
  `,
    ],
    { cwd: root, encoding: 'utf8' },
  );
  assert.equal((html.match(/data-body=/g) || []).length, 4);
  assert.equal((html.match(/aria-haspopup="dialog"/g) || []).length, 5);
  const groups = [...html.matchAll(/<button[^>]*data-constellation="\d+"[^>]*>/g)].map(
    ([tag]) => tag,
  );
  assert.equal(groups.length, 2);
  assert.ok(html.includes('About Astra, northern constellation'));
  assert.ok(html.includes('About Astra, southern constellation'));
  assert.doesNotMatch(html, /data-star=|star-keyboard-help|tabindex="-1"/);
  for (const name of ['Sol', 'Luna', 'Terra'])
    assert.ok(html.includes(`aria-label="About ${name}"`));
});

test('multiaxis depth is bounded, pointer-relative and neutral on reduced/touch/keyboard', () => {
  const bounds = { left: 0, top: 0, width: 240, height: 150 };
  const depth = celestialDepth({ x: 9999, y: -9999 }, { x: -9999, y: 9999 }, bounds, true);
  assert.equal(depth.x, 1.2);
  assert.equal(depth.y, 1.2);
  assert.equal(depth.z, -0.12);
  assert.equal(depth.depth, 2);
  assert.equal(depth.origin, '75% 25%');
  assert.deepEqual(celestialDepth(null, { x: 0, y: 0 }, bounds, false), {
    x: 0,
    y: 0,
    z: 0,
    depth: 0,
    origin: '50% 50%',
  });
});

test('moving sky geometry preserves solar overlap, flips, viewport clamps and origins', () => {
  const bounds = { left: 100, top: 100, right: 420, width: 320, height: 320 };
  const anchor = { left: 135, top: 135, right: 385, bottom: 385, width: 250, height: 250 };
  const input = {
    body: 'sol',
    anchor,
    bounds,
    width: 240,
    height: 140,
    viewportWidth: 1180,
    viewportHeight: 800,
  };
  const below = celestialPlacement(input);
  assert.equal(below.side, 'bottom');
  assert.equal(below.y, 320 * 0.84);
  assert.equal(below.x, 40);
  assert.equal(below.origin, '120px 0px');
  const above = celestialPlacement({
    ...input,
    bounds: { ...bounds, top: 500 },
    anchor: { ...anchor, top: 535, bottom: 785 },
  });
  assert.equal(above.side, 'top');
  assert.equal(above.origin, '120px 140px');
  for (const body of ['astra', 'luna', 'terra']) {
    const result = celestialPlacement({ ...input, body, viewportWidth: 390, viewportHeight: 300 });
    assert.ok(result.x + bounds.left >= 8);
    assert.ok(result.x + bounds.left + 240 <= 382);
    assert.ok(result.y + bounds.top >= 8);
    assert.ok(result.y + bounds.top + 140 <= 292);
  }
});

test('Base UI owns sky lifecycle and semantics while ui.js only paints', async () => {
  const component = await readFile(new URL('../src/design/celestial.tsx', import.meta.url), 'utf8');
  const paint = await readFile(new URL('../ui.js', import.meta.url), 'utf8');
  for (const part of ['Root', 'Trigger', 'Positioner', 'Popup', 'Title', 'Description'])
    assert.ok(component.includes(`<Popover.${part}`));
  assert.doesNotMatch(component, /aria-expanded=|aria-controls=|createDisclosure/);
  assert.doesNotMatch(
    paint,
    /showBody|aria-expanded|createDisclosure|querySelectorAll\('\.celestial-focus/,
  );
  assert.match(component, /openOnHover/);
  assert.match(component, /closeDelay=\{400\}/);
  assert.match(component, /prefers-reduced-motion/);
});

test('sky phases visibly accelerate smoothly and exceed the previous linear rates', async () => {
  const { celestialPhases } = await import('../src/design/celestial-motion.js');
  const at = celestialPhases;
  const first = at(0),
    next = at(2);
  assert.ok(next.solar - first.solar > 2 * 3.6 * 2);
  assert.ok(next.luna - first.luna > ((2 * Math.PI * 2) / 44) * 1.5);
  assert.ok(first.terra - next.terra > ((2 * Math.PI * 2) / 67) * 1.5);
  const speeds = { solar: [], luna: [], terra: [] };
  for (let t = 0; t < 120; t += 0.1) {
    const a = at(t),
      b = at(t + 0.01);
    for (const key of Object.keys(speeds)) speeds[key].push(Math.abs((b[key] - a[key]) / 0.01));
    assert.ok(b.solar > a.solar && b.luna > a.luna && b.terra < a.terra);
    assert.ok(Math.abs(b.driftX - a.driftX) < 0.04 && Math.abs(b.driftY - a.driftY) < 0.04);
  }
  for (const values of Object.values(speeds)) {
    assert.ok(Math.max(...values) / Math.min(...values) > 1.8);
    for (let i = 1; i < values.length; i++) assert.ok(Math.abs(values[i] - values[i - 1]) < 0.15);
  }
  assert.deepEqual(at(12), at(12)); // The stopped elapsed clock produces the same geometry.
});

test('the painted constellations remain two groups of thirteen total stars and all orbital paths are dashed', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.equal((html.match(/data-constellation-art=/g) || []).length, 2);
  assert.equal((html.match(/<use href="#spark"/g) || []).length, 13);
  assert.match(html, /class="orbit-ink" fill="none" stroke-dasharray="3 7"/);
});

test('real solar direction dominates opposing pointer motion on both axes', () => {
  const bounds = { left: 0, top: 0, width: 240, height: 150 };
  const solarLeftAbove = celestialDepth(
    { x: -9999, y: -9999 },
    { x: -9999, y: -9999 },
    bounds,
    true,
  );
  assert.equal(solarLeftAbove.y, 0.6);
  assert.equal(solarLeftAbove.x, -0.6);
  const solarRightBelow = celestialDepth({ x: 9999, y: 9999 }, { x: 9999, y: 9999 }, bounds, true);
  assert.equal(solarRightBelow.y, -0.6);
  assert.equal(solarRightBelow.x, 0.6);
  const aligned = celestialDepth({ x: 9999, y: 9999 }, { x: 120, y: 75 }, bounds, true);
  assert.equal(aligned.y, 0.3);
  assert.equal(aligned.x, -0.3);
});

test('solar filaments deform differentially without flash or phase resets', async () => {
  const { solarFilament } = await import('../src/design/celestial-motion.js');
  assert.notEqual(solarFilament(2, 0).stretch, solarFilament(2, 1).stretch);
  for (let i = 0; i < 12; i++)
    for (let t = 0; t < 30; t += 0.1) {
      const a = solarFilament(t, i),
        b = solarFilament(t + 0.016, i);
      assert.ok(a.opacity >= 0.2 && a.opacity <= 0.4);
      assert.ok(a.stretch >= 0.975 && a.stretch <= 1.025);
      assert.ok(Math.abs(a.opacity - b.opacity) < 0.001);
      assert.ok(Math.abs(a.angle - b.angle) < 0.02);
    }
});

test('captured anchor stays still between sky frames and reprojects through scroll', async () => {
  const { anchoredRect } = await import('../src/design/celestial-geometry.js');
  const anchor = { left: 80, top: 90, width: 44, height: 44 };
  const bounds = { left: 30, top: 200 };
  assert.deepEqual(anchoredRect(anchor, bounds), anchoredRect(anchor, bounds));
  const scrolled = anchoredRect(anchor, { left: 30, top: -80 });
  assert.equal(scrolled.left, 110);
  assert.equal(scrolled.top, 10);
  assert.equal(scrolled.bottom, 54);
  const source = await readFile(new URL('../src/design/celestial.tsx', import.meta.url), 'utf8');
  assert.match(source, /fixedAnchor.current.id !== active/);
  assert.match(source, /anchor = anchoredRect\(fixed, bounds\)/);
});
