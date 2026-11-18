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
