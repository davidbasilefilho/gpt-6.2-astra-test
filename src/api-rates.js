// Published model-token prices, not subscription credits or total execution cost.
// Order: new input, cache read, 30-minute write, 12-hour write, output.
export const standardRates = { Sol: [2, 0.1, 2.5, 5, 10], Astra: [8, 0.4, 10, 20, 40] };
export const tiers = [
  { label: 'Standard', factor: 1 },
  { label: 'Batch', factor: 0.5 },
  { label: 'Fast', factor: 2 },
  { label: 'Ultrafast (launch)', factor: 3 },
  { label: 'Ultrafast (list)', factor: 6 },
  { label: 'Background · 2h', factor: 0.7 },
  { label: 'Background · 8h', factor: 0.6 },
];
export function rateFor(model, tier, longContext) {
  return standardRates[model].map((n, i) =>
    Number((n * tier * (longContext ? (i === 4 ? 1.5 : 2) : 1)).toFixed(5)),
  );
}
