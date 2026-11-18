import { defineChart } from '@tanstack/charts';
import { barX } from '@tanstack/charts/bar';
import { scaleBand } from '@tanstack/charts/scales/band';
import { scaleLinear } from '@tanstack/charts/scales/linear';
import { text } from '@tanstack/charts/text';

type Row = { series: string; value: number; display: string; tone: string };
const historical: Row[] = [
  { series: 'GPT-6 Astra', value: 2897, display: '$2,897', tone: 'var(--accent)' },
  { series: 'Fable 5.1', value: 2485, display: '$2,485', tone: 'var(--star)' },
];
const proxy: Row[] = [
  { series: 'API list price', value: 0.788, display: '$0.788', tone: 'var(--accent)' },
  { series: 'Pro 10× proxy', value: 0.063, display: '$0.063', tone: 'var(--star)' },
];
function comparisonChart(rows: Row[], max: number) {
  return defineChart({
    margin: { left: 95, right: 24, top: 5, bottom: 27 },
    scales: {
      x: {
        scale: scaleLinear().domain([0, max]),
        grid: true,
        axis: {
          tickLabels: { fontSize: 12, opacity: 1 },
          ticks: {
            count: 4,
            format: (v) => '$' + v.toLocaleString('en-US', { maximumFractionDigits: 2 }),
          },
        },
      },
      y: {
        axis: { tickLabels: { fontSize: 13, opacity: 1 } },
        scale: scaleBand()
          .domain(rows.map((row) => row.series))
          .padding(0.18),
      },
    },
    marks: [
      barX(rows, { x: 'value', y: 'series', maxThickness: 26, fill: (r) => r.tone }),
      text(rows, {
        x: 'value',
        y: 'series',
        text: 'display',
        key: 'series',
        fontSize: 13,
        fontWeight: 650,
        anchor: (r) => (r.value < max * 0.25 ? 'start' : 'end'),
        dx: (r) => (r.value < max * 0.25 ? 8 : -8),
        fill: (r) => (r.value < max * 0.25 ? 'var(--ink)' : 'var(--paper)'),
      }),
    ],
  });
}
export const historyChart = comparisonChart(historical, 3000);
export const proxyChart = comparisonChart(proxy, 0.8);
