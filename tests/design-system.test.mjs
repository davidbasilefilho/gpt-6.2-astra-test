import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');

test('shared square surfaces and motion tokens retain the editorial contract', async () => {
  const [html, css, motion, page] = await Promise.all(
    ['../index.html', '../design-system.css', '../src/design/motion.ts', '../src/shared.tsx'].map(
      read,
    ),
  );
  assert.doesNotMatch(html, /motion-toggle|data-pick|Fig\. 1/);
  assert.match(css, /--radius-control:\s*0px/);
  for (const [name, ms] of [
    ['fast', 140],
    ['enter', 210],
    ['disclose', 260],
  ]) {
    assert.ok(css.includes(`--motion-${name}: ${ms}ms`));
    assert.ok(motion.includes(`${name}: ${ms / 1000}`));
  }
  assert.doesNotMatch(page, /atlas-chapter|Back to the atlas/);
});

test('real shared Base UI button renders button semantics while navigation remains an anchor', () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const html = execFileSync(
    `${root}node_modules/.bin/bun`,
    [
      '-e',
      `
    import { renderToStaticMarkup } from 'react-dom/server';
    import { createElement } from 'react';
    import { ActionButton, ButtonLink } from './src/design/components.tsx';
    console.log(renderToStaticMarkup(createElement('div', null,
      createElement(ActionButton, { disabled: true, variant: 'ghost', size: 'sm' }, 'Unavailable action'),
      createElement(ButtonLink, { href: '/sources', variant: 'outline' }, 'Inspect sources'))));
  `,
    ],
    { cwd: root, encoding: 'utf8' },
  );
  assert.match(html, /<button[^>]*type="button"[^>]*>/);
  assert.match(html, /<button[^>]*disabled/);
  assert.match(html, /ds-action--ghost/);
  assert.match(html, /ds-size--sm/);
  assert.match(html, /<a[^>]*href="\/sources"[^>]*>Inspect sources<\/a>/);
  assert.doesNotMatch(html, /<a[^>]*role="button"/);
});

test('theme trigger keeps its visible label, selected-state icon and symmetric pivot', async () => {
  const [appearance, css] = await Promise.all(
    ['../src/design/appearance.tsx', '../styles.css'].map(read),
  );
  assert.match(appearance, /<span>Theme<\/span>/);
  assert.match(appearance, /aria-label=\{`Theme: \$\{appearance\}/);
  for (const icon of ['monitor', 'sun', 'moon']) assert.ok(appearance.includes(`icon: '${icon}'`));
  assert.match(
    css,
    /\.theme-chevron\s*\{[^}]*transform-box:\s*view-box;[^}]*transform-origin:\s*50% 50%/,
  );
  assert.match(
    css,
    /#theme-trigger\[aria-expanded='true'\] \.theme-chevron\s*\{[^}]*rotate\(180deg\)/,
  );
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
