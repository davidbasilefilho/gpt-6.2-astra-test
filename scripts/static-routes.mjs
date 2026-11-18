import { mkdir, readFile, writeFile } from 'node:fs/promises';
const root = new URL('../dist/', import.meta.url);
const html = await readFile(new URL('index.html', root), 'utf8');
const routes = {
  compare: 'The guide',
  'field-notes': 'Field notes',
  sources: 'Sources',
  access: 'Access',
};
for (const [path, title] of Object.entries(routes)) {
  await mkdir(new URL(`${path}/`, root), { recursive: true });
  const page = html
    .replace(/<title>.*?<\/title>/, `<title>${title} · The Field Atlas</title>`)
    .replace('<main id="landing">', '<main id="landing" hidden>');
  await writeFile(new URL(`${path}/index.html`, root), page);
}
await writeFile(
  new URL('404.html', root),
  html.replace('<main id="landing">', '<main id="landing" hidden>'),
);
console.log(`Created ${Object.keys(routes).length} direct-entry route documents and 404 fallback.`);
