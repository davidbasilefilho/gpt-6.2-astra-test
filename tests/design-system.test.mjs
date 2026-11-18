import assert from 'node:assert/strict';
import { existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { createDisclosure, cssTimeMs, disclosureMotion } from '../src/design/disclosure.js';
function fixture(tokens = {}) {
  const obj = {
    hidden: true,
    inert: true,
    dataset: {},
    setAttribute() {},
    animate(frames, options) {
      let resolve, reject;
      const finished = new Promise((ok, no) => {
        resolve = ok;
        reject = no;
      });
      const a = {
        frames,
        options,
        finished,
        finish: () => resolve(),
        cancel: () => reject(new Error('replaced')),
      };
      pending.push(a);
      return a;
    },
  };
  const pending = [];
  const handlers = [];
  const reduce = {
    matches: false,
    addEventListener(t, fn) {
      handlers.push(fn);
    },
  };
  const style = { opacity: '1', translate: 'none', getPropertyValue: (name) => tokens[name] || '' };
  const disclose = createDisclosure({ root: {}, reduce, readStyle: () => style });
  return { obj, disclose, pending, reduce, handlers };
}
test('overlay exit is inert immediately; interrupted exit cannot hide a reopened surface', async () => {
  const { obj, disclose, pending } = fixture();
  disclose(obj, true);
  assert.equal(obj.hidden, false);
  disclose(obj, false);
  assert.equal(obj.inert, true);
  assert.equal(obj.hidden, false);
  disclose(obj, true);
  pending.forEach((a) => a.finish());
  await new Promise((r) => setImmediate(r));
  assert.equal(obj.hidden, false);
  assert.equal(obj.inert, false);
  disclose(obj, false);
  pending.forEach((a) => a.finish());
  await new Promise((r) => setImmediate(r));
  assert.equal(obj.hidden, true);
});
test('reduced motion settles in-flight overlays and skips new animations', () => {
  const { obj, disclose, pending, reduce, handlers } = fixture();
  disclose(obj, true);
  disclose(obj, false);
  reduce.matches = true;
  handlers.forEach((fn) => fn());
  assert.equal(obj.hidden, true);
  const count = pending.length;
  disclose(obj, true);
  assert.equal(obj.hidden, false);
  assert.equal(pending.length, count);
});
test('all constellation stars and four celestial bodies, square controls, standardized motion and no ornamental chapter labels', async () => {
  const read = (p) => readFile(new URL(p, import.meta.url), 'utf8');
  const [html, css, ts, page] = await Promise.all(
    ['../index.html', '../design-system.css', '../src/design/motion.ts', '../src/shared.tsx'].map(
      read,
    ),
  );
  assert.equal((html.match(/data-star="/g) || []).length, 13);
  assert.equal((html.match(/data-body="/g) || []).length, 4);
  assert.equal((html.match(/data-orbit="/g) || []).length, 2);
  assert.ok(
    !html.includes('motion-toggle') && !html.includes('data-pick') && !html.includes('Fig. 1'),
  );
  assert.match(css, /--radius-control:\s*0px/);
  for (const [n, ms] of [
    ['fast', 140],
    ['enter', 210],
    ['disclose', 260],
  ]) {
    assert.ok(css.includes(`--motion-${n}: ${ms}ms`));
    assert.ok(ts.includes(`${n}: ${ms / 1000}`));
  }
  assert.ok(!page.includes('atlas-chapter') && !page.includes('Back to the atlas'));
});
test('the option list itself animates in both directions and remains mounted until exit settles', async () => {
  const { obj, disclose, pending } = fixture();
  const listFrames = [];
  const surfaceFrames = [];
  const animate = obj.animate.bind(obj);
  obj.animate = (frames, opts) => {
    surfaceFrames.push(frames);
    return animate(frames, opts);
  };
  obj.querySelector = (selector) =>
    selector === '[data-disclosure-content]'
      ? {
          animate(frames, opts) {
            listFrames.push(frames);
            return animate(frames, opts);
          },
        }
      : null;
  disclose(obj, true);
  assert.deepEqual(listFrames[0], [
    { opacity: 0, translate: '0px -10px' },
    { opacity: 1, translate: '0 0' },
  ]);
  assert.match(surfaceFrames[2][0].clipPath, /68%/);
  assert.match(surfaceFrames[2][1].clipPath, /0% 0% 0% 0%/);
  pending.forEach((a) => a.finish());
  await new Promise((r) => setImmediate(r));
  disclose(obj, false);
  assert.deepEqual(listFrames[1][1], { opacity: 0, translate: '0px -10px' });
  assert.equal(obj.hidden, false);
  assert.match(surfaceFrames[5][1].clipPath, /68%/);
  pending.forEach((a) => a.finish());
  await new Promise((r) => setImmediate(r));
  assert.equal(obj.hidden, true);
});
test('menu trigger is named, keyboard-sized, and its SVG chevron rotates about a symmetric fixed pivot', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const css = await readFile(new URL('../styles.css', import.meta.url), 'utf8');
  assert.match(
    html,
    /id="theme-trigger"[\s\S]*?aria-haspopup="menu"[\s\S]*?aria-label="Theme: system"/,
  );
  assert.match(
    html,
    /class="theme-chevron"[\s\S]*?viewBox="0 0 24 24"[\s\S]*?ui-icons\.svg#chevron-down/,
  );
  assert.match(
    css,
    /\.theme-chevron\s*\{[^}]*transform-box:\s*view-box;[^}]*transform-origin:\s*50% 50%/,
  );
  assert.match(
    css,
    /#theme-trigger\[aria-expanded='true'\] \.theme-chevron\s*\{[^}]*rotate\(180deg\)/,
  );
});

test('CSS durations retain units after production minification, including intentional zero', () => {
  assert.equal(cssTimeMs('210ms', 999), 210);
  assert.equal(cssTimeMs('.21s', 999), 210);
  assert.equal(cssTimeMs(' 0.26s ', 999), 260);
  assert.equal(cssTimeMs('0s', 999), 0);
  assert.equal(cssTimeMs('0ms', 999), 0);
  assert.equal(cssTimeMs('', 210), 210);
  assert.equal(cssTimeMs('nonsense', 210), 210);
});
test('real minified production CSS yields multi-frame animations on both surfaces and directions', async (t) => {
  const { readdir } = await import('node:fs/promises');
  const dir = new URL('../dist/assets/', import.meta.url);
  if (!existsSync(dir)) {
    t.skip('Build first to inspect optimized CSS; unit conversion cases still run.');
    return;
  }
  const files = (await readdir(dir)).filter((name) => name.endsWith('.css'));
  const css = (await Promise.all(files.map((file) => readFile(new URL(file, dir), 'utf8')))).join(
    '\n',
  );
  const tokens = {};
  for (const key of ['--motion-fast', '--motion-enter', '--motion-disclose']) {
    const value = css.match(new RegExp(`${key}:([^;}]+)`))?.[1];
    assert.ok(value, `Missing production token ${key}; run build first`);
    tokens[key] = value;
  }
  for (const content of [false, true]) {
    const { obj, disclose, pending } = fixture(tokens);
    if (content) obj.querySelector = () => ({ animate: obj.animate.bind(obj) });
    disclose(obj, true);
    assert.ok(pending.every((animation) => animation.options.duration >= 210));
    pending.forEach((animation) => animation.finish());
    await new Promise((resolve) => setImmediate(resolve));
    const start = pending.length;
    disclose(obj, false);
    assert.equal(obj.hidden, false);
    assert.ok(pending.slice(start).every((animation) => animation.options.duration === 210));
    pending.forEach((animation) => animation.finish());
    await new Promise((resolve) => setImmediate(resolve));
    assert.equal(obj.hidden, true);
  }
});

test('theme trigger retains visible text and an identifiable selected-state glyph', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const ui = await readFile(new URL('../ui.js', import.meta.url), 'utf8');
  assert.match(html, /<span>Theme<\/span>/);
  assert.doesNotMatch(html, /phase-night|phase-rays|phase-hatch/);
  assert.match(ui, /selectedIcon\.childNodes/);
});

test('celestial perspective stays within 2.2 degrees and neutralizes without a fine mouse', async () => {
  const { perspectiveAngles } = await import('../src/design/perspective.js');
  const bounds = { top: 20, left: 20, width: 240, height: 150 };
  assert.deepEqual(perspectiveAngles({ x: 140, y: 95 }, bounds, true), { x: -0, y: 0 });
  assert.deepEqual(perspectiveAngles({ x: 10000, y: -10000 }, bounds, true), { x: 2.2, y: 2.2 });
  assert.deepEqual(perspectiveAngles({ x: 10000, y: -10000 }, bounds, false), { x: 0, y: 0 });
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.equal((html.match(/class="popover-surface ds-overlay"/g) || []).length, 4);
});

test('constellation roves one tab stop, wraps arrows, Home/End, and tabs onward to Luna', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const ui = await readFile(new URL('../ui.js', import.meta.url), 'utf8');
  const buttons = [...html.matchAll(/<button\s[^>]*data-star="\d+"[^>]*>/g)].map(([tag]) => tag);
  assert.equal(buttons.length, 13);
  assert.equal(buttons.filter((tag) => tag.includes('tabindex="0"')).length, 1);
  assert.equal(buttons.filter((tag) => tag.includes('tabindex="-1"')).length, 12);
  assert.ok(buttons.every((tag) => tag.includes('aria-describedby="star-keyboard-help"')));
  const { runInNewContext } = await import('node:vm');
  let focused;
  const stars = Array.from({ length: 13 }, (_, i) => ({
    tabIndex: i === 0 ? 0 : -1,
    handlers: {},
    addEventListener(key, handler) {
      this.handlers[key] = handler;
    },
    focus(options) {
      assert.equal(options.preventScroll, true);
      focused = i;
      this.handlers.focus();
    },
  }));
  runInNewContext(
    ui.slice(ui.indexOf('starTargets.forEach((target, index)'), ui.indexOf('const bodyAnchors')),
    {
      starTargets: stars,
      orbitTargets: [
        {
          focus() {
            focused = 'luna';
          },
        },
      ],
    },
  );
  const press = (i, key, shiftKey = false) => {
    let prevented = false;
    stars[i].handlers.keydown({
      key,
      shiftKey,
      preventDefault() {
        prevented = true;
      },
    });
    return prevented;
  };
  for (const [from, key, to] of [
    [0, 'ArrowLeft', 12],
    [12, 'ArrowRight', 0],
    [0, 'ArrowDown', 1],
    [1, 'ArrowUp', 0],
    [0, 'End', 12],
    [12, 'Home', 0],
  ]) {
    assert.equal(press(from, key), true);
    assert.equal(focused, to);
    assert.equal(stars.filter((star) => star.tabIndex === 0).length, 1);
    assert.equal(stars[to].tabIndex, 0);
  }
  stars[7].focus({ preventScroll: true });
  assert.equal(stars[7].tabIndex, 0);
  assert.equal(press(7, 'Tab'), true);
  assert.equal(focused, 'luna');
  assert.equal(press(7, 'Tab', true), false);
  assert.equal(press(7, 'Escape'), false);
});

test('Tabler sprite is finite, accessible by shared API, and preserves original celestial art', async () => {
  const [sprite, api, generator, html, mark, license] = await Promise.all(
    [
      '../public/assets/ui-icons.svg',
      '../src/design/icons.tsx',
      '../scripts/generate-icons.mjs',
      '../index.html',
      '../src/design/components.tsx',
      '../licenses/Tabler-Icons-MIT.txt',
    ].map((p) => readFile(new URL(p, import.meta.url), 'utf8')),
  );
  const names = [
    'arrow-right',
    'arrow-up-right',
    'check',
    'chevron-down',
    'monitor',
    'moon',
    'plus',
    'sun',
  ];
  assert.equal((sprite.match(/<symbol /g) || []).length, names.length);
  for (const name of names) {
    assert.ok(sprite.includes(`id="${name}" viewBox="0 0 24 24"`));
    assert.ok(api.includes(`'${name}'`));
  }
  assert.match(generator, /renderToStaticMarkup/);
  assert.doesNotMatch(generator, /import \*|dynamic-imports|icons-list/);
  assert.match(api, /aria-hidden="true"/);
  assert.match(api, /focusable="false"/);
  assert.match(mark, /ui-icons\.svg#plus/);
  assert.match(mark, /rotate: open \? 45 : 0/);
  assert.match(mark, /viewBox="0 0 24 24"/);
  assert.equal((html.match(/assets\/mark\.svg#mark/g) || []).length, 2);
  assert.match(license, /Permission is hereby granted/);
});

test('overlay entrances and exits point toward each actual anchor edge', async () => {
  for (const side of ['above', 'below', 'left', 'right']) {
    const { obj, disclose, pending } = fixture();
    obj.dataset.side = side;
    disclose(obj, true);
    assert.equal(pending[1].frames[0].translate, disclosureMotion(side).offset);
    pending.forEach((a) => a.finish());
    await new Promise((r) => setImmediate(r));
    disclose(obj, false); // Escape and outside-dismiss use the same exit.
    assert.equal(pending.at(-1).frames[1].translate, disclosureMotion(side).offset);
    assert.equal(obj.hidden, false);
  }
  assert.equal(disclosureMotion('above').offset, '0px 7px');
  assert.equal(disclosureMotion('below').offset, '0px -7px');
  assert.equal(disclosureMotion('left').offset, '7px 0px');
  assert.equal(disclosureMotion('right').offset, '-7px 0px');
});
test('placement flips mid-scroll retarget existing disclosure without stale hiding; reduced motion settles', async () => {
  const { obj, disclose, pending, reduce, handlers } = fixture();
  obj.dataset.side = 'below';
  disclose(obj, true);
  obj.dataset.side = 'above';
  disclose(obj, true);
  disclose(obj, false);
  assert.equal(pending.at(-1).frames[1].translate, '0px 7px');
  obj.dataset.side = 'below';
  disclose(obj, true);
  pending.forEach((a) => a.finish());
  await new Promise((r) => setImmediate(r));
  assert.equal(obj.hidden, false);
  reduce.matches = true;
  handlers.forEach((fn) => fn());
  disclose(obj, false);
  assert.equal(obj.hidden, true);
});

test('Sol preserves editorial overlap but flips and clamps on scroll or a small viewport', async () => {
  const ui = await readFile(new URL('../ui.js', import.meta.url), 'utf8');
  const { runInNewContext } = await import('node:vm');
  let bounds = { left: 300, top: 150, width: 320, height: 320 };
  const popover = {
    style: {},
    offsetWidth: 240,
    offsetHeight: 140,
    scrollHeight: 140,
    hidden: false,
    dataset: { state: 'open' },
  };
  const target = { closest: () => ({ getBoundingClientRect: () => bounds }) };
  const calls = [];
  const context = {
    innerWidth: 1180,
    innerHeight: 800,
    setOverlayOrigin: (panel, anchor, side) => {
      panel.dataset.side = side;
    },
    disclose: (panel, open) => calls.push({ side: panel.dataset.side, open }),
  };
  runInNewContext(
    ui.slice(ui.indexOf('function placeSolPopover'), ui.indexOf('function placePopover')),
    context,
  );
  const place = () => context.placeSolPopover(popover, target);
  place();
  assert.equal(popover.dataset.side, 'below');
  assert.equal(parseFloat(popover.style.top), 320 * 0.84);
  bounds = { ...bounds, top: 490 };
  place();
  assert.equal(popover.dataset.side, 'above');
  assert.ok(bounds.top + parseFloat(popover.style.top) >= 8);
  popover.dataset.state = 'closing';
  place();
  assert.deepEqual(calls.at(-1), { side: 'above', open: false });
  bounds = { ...bounds, top: -60, left: -20 };
  place();
  assert.equal(popover.dataset.side, 'below');
  assert.ok(bounds.left + parseFloat(popover.style.left) - 120 >= 8);
  context.innerWidth = 390;
  context.innerHeight = 300;
  bounds = { left: 90, top: 80, width: 200, height: 200 };
  place();
  const top = bounds.top + parseFloat(popover.style.top);
  assert.ok(top >= 8 && top + popover.offsetHeight <= 292);
  assert.equal(popover.dataset.side, 'above');
});
