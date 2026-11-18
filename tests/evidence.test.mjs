import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';

import { checkedAt, lensNotes, sources } from '../evidence.js';
import { filterSources } from '../src/evidence-filter.js';

test('every cited source has attribution, HTTPS provenance and a limitation', () => {
  assert.equal(new Set(sources.map((s) => s.id)).size, sources.length);
  for (const source of sources) {
    for (const field of ['id', 'author', 'title', 'summary', 'caveat', 'verification', 'date'])
      assert.ok(source[field], `${source.id}: ${field}`);
    assert.equal(new URL(source.url).protocol, 'https:');
    assert.match(source.date, /^\d{4}-\d{2}-\d{2}$/);
  }
  assert.match(checkedAt, /^\d{4}-\d{2}-\d{2}$/);
});

test('all editorial lens citations resolve', () => {
  const ids = new Set(sources.map((source) => source.id));
  for (const lens of lensNotes) for (const id of lens.sourceIds) assert.ok(ids.has(id));
});

test('official and independent source filters partition the full list', () => {
  const official = filterSources(sources, 'Official');
  const independent = filterSources(sources, 'Independent');
  assert.equal(official.length + independent.length, sources.length);
  assert.ok(official.some((source) => source.id === 'tibo'));
  assert.ok(!independent.some((source) => source.id === 'tibo'));
  assert.ok(independent.some((source) => source.id === 'theo'));
});

test('search is case insensitive, trimmed, composable and can return empty', () => {
  assert.equal(filterSources(sources, 'All', '  THEO  ')[0].id, 'theo');
  assert.equal(filterSources(sources, 'Official', 'Theo').length, 0);
  assert.equal(filterSources(sources, 'All', 'unfindable-albatross').length, 0);
  assert.equal(filterSources(sources, 'All', '').length, sources.length);
});

test('route and accessibility contracts are present', async () => {
  const code = (
    await Promise.all(
      [
        'main.tsx',
        'field-notes.tsx',
        'sources.tsx',
        'shared.tsx',
        'subscription-value.tsx',
        'design/forms.tsx',
      ].map((file) => readFile(new URL(`../src/${file}`, import.meta.url), 'utf8')),
    )
  ).join('\n');
  for (const route of ['/compare', '/field-notes', '/sources', '/access'])
    assert.ok(code.includes(`path: '${route}'`));
  for (const contract of [
    "defaultPreload: 'intent'",
    'defaultViewTransition: true',
    '<WorksheetTabs',
    '<RadioGroup',
    'useReducedMotion',
    '<Activity',
    '<ViewTransition',
  ])
    assert.ok(code.includes(contract), contract);
});

test('skip target is focusable and route pages are code-split', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  assert.match(html, /href="#content"/);
  assert.match(html, /id="content" tabindex="-1"/);
  const main = await readFile(new URL('../src/main.tsx', import.meta.url), 'utf8');
  assert.equal((main.match(/lazyRouteComponent\(/g) ?? []).length, 4);
  assert.ok(main.includes("document.addEventListener('focusin', preloadNativeLink)"));
  const page = await readFile(new URL('../src/shared.tsx', import.meta.url), 'utf8');
  assert.ok(page.includes('tabIndex={-1}'));
  assert.ok(page.includes('focus({ preventScroll: true })'));
});

test('article and footer share a route snapshot; empty lazy content cannot flash an orphaned footer', async () => {
  const read = (path) => readFile(new URL(path, import.meta.url), 'utf8');
  const [html, css, shell] = await Promise.all(
    ['../index.html', '../src/routes.css', '../src/main.tsx'].map(read),
  );
  assert.match(
    html,
    /<div id="route-sheet">[\s\S]*?<main id="landing">[\s\S]*?<div id="atlas-react-root"><\/div>[\s\S]*?<footer[\s\S]*?<\/footer>\s*<\/div>/,
  );
  assert.match(css, /#route-sheet\s*\{\s*view-transition-name:\s*atlas-route/);
  assert.match(
    css,
    /#route-sheet:has\(#landing\[hidden\]\):not\(:has\(#atlas-react-root main:not\(\[aria-busy='true'\]\)\)\)\s+\.footer\s*\{\s*visibility:\s*hidden/,
  );
  assert.ok(shell.includes('state.matches.at(-1)?.pathname'));
});
test('theme help is a semantic tooltip, not the native title attribute', async () => {
  const [html, tooltip] = await Promise.all(
    ['../index.html', '../src/design/tooltip.tsx'].map((path) =>
      readFile(new URL(path, import.meta.url), 'utf8'),
    ),
  );
  assert.ok(!/\stitle=["']/.test(html));
  assert.ok(tooltip.includes('role="tooltip"') && tooltip.includes('aria-describedby'));
});
