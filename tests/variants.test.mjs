import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

test('real cn resolves utilities and shared link variants preserve anchor semantics', () => {
  const root = fileURLToPath(new URL('../', import.meta.url));
  const value = JSON.parse(
    execFileSync(
      `${root}node_modules/.bin/bun`,
      [
        '-e',
        `
    import {cn,controlVariants} from './src/design/variants.ts';
    import {ButtonLink} from './src/design/components.tsx';
    import {createElement} from 'react';
    import {renderToStaticMarkup} from 'react-dom/server';
    console.log(JSON.stringify({ merged:cn('px-2',false,'px-4',{hidden:false}), variant:controlVariants({variant:'ghost',tone:'neutral',size:'sm'}), link:renderToStaticMarkup(createElement(ButtonLink,{href:'/compare',size:'lg'},'Compare')) }));
  `,
      ],
      { cwd: root, encoding: 'utf8' },
    ),
  );
  assert.equal(value.merged, 'px-4');
  assert.equal(value.variant, 'ds-action ds-action--ghost ds-tone--neutral ds-size--sm');
  assert.match(value.link, /<a[^>]*href="\/compare"/);
  assert.doesNotMatch(value.link, /<button|role="button"/);
});

test('hero link has shared variants and explicit action colors maintain text contrast', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const css = await readFile(new URL('../design-system.css', import.meta.url), 'utf8');
  assert.match(
    html,
    /<a\s+class="primary ds-action ds-action--default ds-tone--accent ds-size--lg"\s+href="\/compare"/,
  );
  assert.match(css, /background-color var\(--motion-fast\)/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(css, /data-disabled/);
  function luminance(hex) {
    const [r, g, b] = hex
      .match(/\w\w/g)
      .map((c) => parseInt(c, 16) / 255)
      .map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }
  const pairs = [
    ['a84a2b', 'fff9f2'],
    ['662b1a', 'fff9f2'],
    ['ffd2b5', '36201a'],
    ['d58c70', '36201a'],
    ['c2b5c7', '302834'],
    ['ad9db5', '302834'],
    ['51445c', 'f9eddf'],
    ['62506d', 'f9eddf'],
  ];
  for (const [bg, fg] of pairs) {
    assert.ok(css.includes('#' + bg));
    const a = luminance(bg),
      b = luminance(fg);
    assert.ok((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05) >= 4.5, `${bg}/${fg}`);
  }
});
