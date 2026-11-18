import { mkdir, writeFile } from 'node:fs/promises';

import {
  IconArrowRight,
  IconArrowUpRight,
  IconCheck,
  IconChevronDown,
  IconDeviceDesktop,
  IconMoon,
  IconPlus,
  IconSun,
} from '@tabler/icons-react';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// Explicit imports: no icon namespace, runtime registry, CDN or network fetch.
const icons = {
  'arrow-right': IconArrowRight,
  'arrow-up-right': IconArrowUpRight,
  check: IconCheck,
  'chevron-down': IconChevronDown,
  monitor: IconDeviceDesktop,
  moon: IconMoon,
  plus: IconPlus,
  sun: IconSun,
};
const symbols = Object.entries(icons).map(([name, component]) => {
  const svg = renderToStaticMarkup(createElement(component, { size: 24, stroke: 1.65 }));
  const body = svg.replace(/^<svg\b[^>]*>/, '').replace(/<\/svg>$/, '');
  return `<symbol id="${name}" viewBox="0 0 24 24">${body}</symbol>`;
});
const out = new URL('../public/assets/ui-icons.svg', import.meta.url);
await mkdir(new URL('.', out), { recursive: true });
await writeFile(
  out,
  `<!-- Generated from Tabler Icons. MIT; see licenses/Tabler-Icons-MIT.txt. -->\n<svg xmlns="http://www.w3.org/2000/svg">${symbols.join('')}</svg>\n`,
);
console.log(`Generated ${symbols.length} Tabler UI symbols.`);
