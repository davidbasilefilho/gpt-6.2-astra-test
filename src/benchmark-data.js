// Primary-source snapshot checked 2026-11-18. Numbers are not live leaderboard data.
export const benchmarkCheckedAt = '2026-11-18';
export const benchmarkResults = [
  {
    id: 'frontiercode',
    name: 'FrontierCode 2.0',
    question: 'Would a maintainer merge the change?',
    evaluator: 'Cognition',
    provenance: 'Benchmark-author evaluation',
    astra: 44.2,
    sol: 43.8,
    astraEffort: 'max',
    solEffort: 'max',
    metric: 'Weighted rubric score',
    method: '132 tasks · Codex harness · version 2.0 (27 Oct 2026)',
    caveat:
      'Not a simple pass rate. Cognition develops competing coding agents; these are its measurements, not OpenAI self-reports.',
    url: 'https://cognition.com/frontiercode',
    scoreUrl: 'https://cognition.com/frontiercode',
  },
  {
    id: 'frontiercode-aa',
    name: 'FrontierCode-AA 2.0',
    question: 'The same task suite, a different agent setup.',
    evaluator: 'Artificial Analysis',
    provenance: 'Independent evaluation',
    astra: 49.0,
    sol: 44.4,
    astraEffort: 'xhigh',
    solEffort: 'max',
    metric: 'Mean rubric score',
    method: '132 tasks · Stirrup · 3 attempts/task · 500-turn cap',
    caveat:
      'Selected best displayed effort per model, not equal compute. Do not combine this row with Cognition’s Codex results.',
    url: 'https://artificialanalysis.ai/evaluations/frontiercode-2-0',
    scoreUrl: 'https://artificialanalysis.ai/es/models/comparisons/gpt-6-2-astra-vs-gpt-6-2-sol',
  },
  {
    id: 'terminal-science',
    name: 'Terminal-Bench-Science 0.1',
    question: 'Can the agent finish a scientific workflow?',
    evaluator: 'Artificial Analysis',
    provenance: 'Independent evaluation',
    astra: 78.6,
    sol: 67.6,
    astraEffort: 'xhigh',
    solEffort: 'max',
    metric: 'Pass@1, averaged over 3 repeats',
    method: '70 tasks · mini-swe-agent · dataset 0.1.0',
    caveat:
      'Every test must pass. Selected best displayed effort per model; Sol high also scores 67.6%. This is not Terminal-Bench 4.0.',
    url: 'https://artificialanalysis.ai/evaluations/terminal-bench-science',
    scoreUrl: 'https://artificialanalysis.ai/es/models/comparisons/gpt-6-2-astra-vs-gpt-6-2-sol',
  },
];
export const benchmarkCoverage = [
  {
    name: 'OSWorld 2.0',
    status: 'No independently verified GPT-6.2 result in this snapshot',
    explanation:
      'Long-horizon computer use. The full suite has 108 workflows. Partial reward, binary completion, offline subsets and step budgets answer different questions; they are not interchangeable scores.',
    method: 'Version 2.0 · full/offline split · primary binary metric at 500 steps',
    url: 'https://osworld-v2.xlang.ai/',
  },
  {
    name: 'FrontierSWE V2',
    status: 'Distinct benchmark; no GPT-6.2 entry verified',
    explanation:
      'Not SWE-bench and not FrontierCode. The author’s board lists GPT-6 Astra, not GPT-6.2 Astra. We do not carry a previous generation’s score forward.',
    method: '34 tasks · proximus harness · 5 trials/task · 20-hour budget · mean@5',
    url: 'https://www.frontierswe.com/',
  },
];
