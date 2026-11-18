import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import test from 'node:test';

const source = readFileSync(new URL('../src/design/appearance.tsx', import.meta.url), 'utf8');
const styles = readFileSync(new URL('../src/design/appearance.css', import.meta.url), 'utf8');
const tooltip = readFileSync(new URL('../src/design/tooltip.tsx', import.meta.url), 'utf8');

test('appearance uses Base UI composite semantics, not a second keyboard implementation', () => {
  for (const part of [
    'Root',
    'Trigger',
    'Portal',
    'Positioner',
    'Popup',
    'RadioGroup',
    'RadioItem',
  ]) {
    assert.ok(source.includes(`<Menu.${part}`));
  }
  assert.match(source, /modal=\{false\}/);
  assert.match(source, /closeOnClick/);
  assert.doesNotMatch(source, /onKeyDown|addEventListener\('keydown'/);
  assert.match(tooltip, /Tooltip.Trigger render=\{render\}/);
});

test('appearance preserves preference synchronization and cancellable transition guards', () => {
  for (const marker of [
    'atlas.appearance',
    "'storage'",
    "'popstate'",
    'skipTransition',
    'generation.current',
    'prefers-color-scheme: dark',
    'prefers-reduced-motion: reduce',
  ]) {
    assert.ok(source.includes(marker), marker);
  }
});

test('menu surface and inner content animate from collision-aware origins in both directions', () => {
  for (const marker of [
    'data-starting-style',
    'data-ending-style',
    "data-side='top'",
    "data-side='left'",
    "data-side='right'",
    '--transform-origin',
    '--menu-clip',
    '.ds-menu-content',
    'prefers-reduced-motion: reduce',
  ]) {
    assert.ok(styles.includes(marker), marker);
  }
});
