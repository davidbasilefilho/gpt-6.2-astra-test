import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { createDisclosure } from '../src/design/disclosure.js';
function fixture() {
  const obj = {
    hidden: true,
    inert: true,
    dataset: {},
    setAttribute() {},
    animate() {
      let resolve, reject;
      const finished = new Promise((ok, no) => {
        resolve = ok;
        reject = no;
      });
      const a = { finished, finish: () => resolve(), cancel: () => reject(new Error('replaced')) };
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
  const style = { opacity: '1', translate: 'none', getPropertyValue: () => '' };
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
test('two direct chart targets, square controls, standardized motion and no ornamental chapter labels', async () => {
  const read = (p) => readFile(new URL(p, import.meta.url), 'utf8');
  const [html, css, ts, page] = await Promise.all(
    ['../index.html', '../design-system.css', '../src/design/motion.ts', '../src/shared.tsx'].map(
      read,
    ),
  );
  assert.equal((html.match(/class="planet-target"/g) || []).length, 2);
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
    { opacity: 0, translate: '0 -10px' },
    { opacity: 1, translate: '0 0' },
  ]);
  assert.match(surfaceFrames[2][0].clipPath, /68%/);
  assert.match(surfaceFrames[2][1].clipPath, /0% 0% 0% 0%/);
  pending.forEach((a) => a.finish());
  await new Promise((r) => setImmediate(r));
  disclose(obj, false);
  assert.deepEqual(listFrames[1][1], { opacity: 0, translate: '0 -10px' });
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
    /id="theme-trigger"[\s\S]*?aria-haspopup="menu"[\s\S]*?aria-label="Appearance: system"/,
  );
  assert.match(
    html,
    /class="theme-chevron"[\s\S]*?viewBox="0 0 16 16"[\s\S]*?m3.5 5.75 4.5 4.5 4.5-4.5/,
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
