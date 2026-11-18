import { benchmarkCheckedAt, benchmarkCoverage, benchmarkResults } from './benchmark-data.js';

import './benchmarks.css';

export function Benchmarks() {
  return (
    <section className="atlas-benchmarks atlas-section" aria-labelledby="benchmarks-heading">
      <div className="atlas-section-head">
        <h2 id="benchmarks-heading">Measured, not promised</h2>
      </div>
      <p className="benchmark-intro">
        Independent runs and benchmark-author results, kept separate from vendor claims. Compare
        within a row, not across different tests.
      </p>
      <p className="benchmark-stamp">
        Snapshot checked <time dateTime={benchmarkCheckedAt}>18 November 2026</time>. Higher is
        better; these scores are not ChatGPT subscription guarantees.
      </p>
      <div className="benchmark-ledger">
        {benchmarkResults.map((result) => (
          <article className="benchmark-row" key={result.id} aria-labelledby={`${result.id}-title`}>
            <div className="benchmark-context">
              <span className="benchmark-provenance">{result.provenance}</span>
              <h3 id={`${result.id}-title`}>{result.name}</h3>
              <p>{result.question}</p>
              <span className="benchmark-evaluator">Measured by {result.evaluator}</span>
            </div>
            <div className="benchmark-measurement">
              <dl className="benchmark-values" aria-label={`${result.name} results`}>
                {(['sol', 'astra'] as const).map((model) => (
                  <div className={`benchmark-value benchmark-value--${model}`} key={model}>
                    <dt>
                      GPT-6.2 {model === 'sol' ? 'Sol' : 'Astra'}
                      <span>{model === 'sol' ? result.solEffort : result.astraEffort} effort</span>
                    </dt>
                    <dd>
                      {result[model].toFixed(1)}
                      <span>%</span>
                    </dd>
                    <span
                      className="benchmark-bar"
                      aria-hidden="true"
                      style={{ width: `${result[model]}%` }}
                    />
                  </div>
                ))}
              </dl>
              <p className="benchmark-method">
                {result.metric}. {result.method}.
              </p>
              <p className="benchmark-caveat">{result.caveat}</p>
              <div className="benchmark-links">
                <a href={result.url}>Method &amp; leaderboard</a>
                {result.scoreUrl !== result.url ? (
                  <a href={result.scoreUrl}>Exact model results</a>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
      <div className="benchmark-coverage">
        {benchmarkCoverage.map((item) => (
          <article key={item.name}>
            <h3>{item.name}</h3>
            <p className="benchmark-status">{item.status}</p>
            <p>{item.explanation}</p>
            <p className="benchmark-method">{item.method}.</p>
            <a href={item.url}>Read the benchmark</a>
          </article>
        ))}
      </div>
      <p className="benchmark-footnote">
        A score measures a model plus its tools, instructions and time allowance. Missing means
        unverified here, not zero. OpenAI self-reported results are not mixed into these
        comparisons.
      </p>
    </section>
  );
}
