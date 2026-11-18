import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));

test('real TanStack scenes retain fixed scales, order and exact values at phone and desktop widths', () => {
  const rendered = JSON.parse(
    execFileSync(
      join(root, 'node_modules/.bin/bun'),
      [
        '-e',
        `
    import {createChartScene,renderChartSvg} from '@tanstack/charts';
    import {historyChart,proxyChart} from './src/value-chart';
    console.log(JSON.stringify([280,360,900].flatMap(width => [historyChart,proxyChart].map(def => {
      const scene=createChartScene(def,{width,height:148});
      return {x:scene.scales.x.domain,y:scene.scales.y.domain,svg:renderChartSvg(scene,{ariaLabel:'Comparison'})};
    }))));
  `,
      ],
      { cwd: root, encoding: 'utf8' },
    ),
  );
  rendered.forEach(({ x, y, svg }, i) => {
    assert.deepEqual(x, i % 2 === 0 ? [0, 3000] : [0, 0.8]);
    assert.deepEqual(
      y,
      i % 2 === 0 ? ['GPT-6 Astra', 'Fable 5.1'] : ['API list price', 'Pro 10× proxy'],
    );
    for (const value of i % 2 === 0 ? ['$2,897', '$2,485'] : ['$0.788', '$0.063'])
      assert.ok(svg.includes(value));
    assert.ok(!svg.includes('NaN') && !svg.includes('Infinity'));
  });
});
test('application widgets are Base UI compositions, not standalone native replacements', async () => {
  async function walk(path) {
    const entries = await readdir(path, { withFileTypes: true });
    return (
      await Promise.all(
        entries.map((e) => (e.isDirectory() ? walk(join(path, e.name)) : [join(path, e.name)])),
      )
    ).flat();
  }
  const paths = [
    join(root, 'index.html'),
    ...(await walk(join(root, 'src'))).filter((p) => p.endsWith('.tsx')),
  ];
  for (const path of paths) {
    const code = (await readFile(path, 'utf8')).replace(
      /render=\{<button type="button" aria-label=\{choice.label\} \/>\}/g,
      '',
    );
    assert.doesNotMatch(
      code,
      /<(?:button|input|select|textarea|details|dialog|fieldset|progress|meter)(?=[\s/>])/,
      path,
    );
  }
});
