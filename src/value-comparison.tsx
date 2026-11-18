import { Chart } from '@tanstack/charts/react';

import { AtlasTabs } from './design/forms';
import { Cite } from './study-components';
import { historyChart, proxyChart } from './value-chart';

import './value-comparison.css';

export function ValueComparison() {
  return (
    <section className="atlas-study atlas-value" id="value">
      <h2>What does $200 buy?</h2>
      <p className="study-lede">
        A monthly subscription buys access under a weekly allowance, not a fixed number of finished
        tasks.
      </p>
      <div className="value-plans">
        <article>
          <h3>
            ChatGPT Pro <small>$200 / month</small>
          </h3>
          <p>Work and Codex share a weekly allowance, with no five-hour cap on this tier.</p>
          <Cite href="https://help.openai.com/en/articles/20001516-managing-usage-with-gpt-6-astra-in-work-and-codex">
            OpenAI usage limits
          </Cite>
        </article>
        <article>
          <h3>
            Claude Ultra <small>$200 / month</small>
          </h3>
          <p>
            10× Claude Pro’s weekly usage. Verified subscribers have no five-hour cap, but Fable has
            a separate limit.
          </p>
          <Cite href="https://support.claude.com/en/articles/17728952-what-is-the-ultra-plan">
            Claude Ultra limits
          </Cite>
        </article>
      </div>
      <aside className="value-credits">
        <strong>Both plans also offer $200 in monthly API credits.</strong> Eligibility and
        activation apply. Credits expire; they do not add tasks to either subscription.
        <div>
          <Cite href="https://developers.openai.com/api/docs/guides/chatgpt-api-credits">
            OpenAI credit terms
          </Cite>
          <Cite href="https://support.claude.com/en/articles/17154008-monthly-api-credits-for-max-ultra-and-team-plans">
            Claude credit terms
          </Cite>
        </div>
      </aside>
      <section className="value-evidence" id="pricing-history">
        <h3>What independent estimates show</h3>
        <AtlasTabs
          label="Independent value estimates"
          items={[
            {
              value: 'history',
              label: 'Historical usage',
              content: (
                <figure>
                  <figcaption>
                    <strong>API cost of usage observed</strong>
                    <span>SemiAnalysis · October 5, 2026 · US dollars</span>
                  </figcaption>
                  <Chart
                    definition={historyChart}
                    height={148}
                    ariaLabel="Historical usage at API rates"
                    ariaDescription="GPT-6 Astra: $2,897 for a full allowance. Fable 5.1: $2,485 for roughly half its allowance."
                  />
                  <p>
                    The $2,897 figure prices a <strong>full</strong> GPT-6 Astra allowance; $2,485
                    prices <strong>roughly half</strong> the compared Fable 5.1 allowance. These are
                    different amounts of use, not a head-to-head capacity test. OpenAI changed its
                    quotas on October 29.
                  </p>
                  <Cite href="https://newsletter.semianalysis.com/p/anthropic-subscriptions-offer-5x">
                    Read the study
                  </Cite>
                  <Cite href="https://help.openai.com/en/articles/9793128-about-chatgpt-pro-tiers">
                    October quota revision
                  </Cite>
                </figure>
              ),
            },
            {
              value: 'proxy',
              label: 'Token-price estimate',
              content: (
                <figure>
                  <figcaption>
                    <strong>Price per million mixed tokens</strong>
                    <span>MyPriors · GPT-6.2 Astra · US dollars</span>
                  </figcaption>
                  <Chart
                    definition={proxyChart}
                    height={148}
                    ariaLabel="MyPriors mixed-token price estimate"
                    ariaDescription="API: $0.788 per million mixed tokens; estimated Pro 10×: $0.063. The proxy is for the $100 plan, not the $200 plan."
                  />
                  <p>
                    MyPriors estimates $0.788 at API rates versus $0.063 under{' '}
                    <strong>Pro 10× ($100, not $200)</strong>. Its model assumes the prior Astra
                    quota and a mix of 97% cache reads, 2.5% fresh input and 0.5% output. That mix
                    was not measured for 6.2.
                  </p>
                  <Cite href="https://mypriors.com/models/gpt-6.2-astra?r=aa">
                    Inspect the assumptions
                  </Cite>
                </figure>
              ),
            },
          ]}
        />
      </section>
      <p className="atlas-caveat value-endnote">
        Neither estimate measures a provider’s subsidy. No comparable measurement establishes weekly
        GPT-6.2 versus Fable 5.2 completions on these $200 plans; that would require observed quota
        and tokens per attempt, including failures, and an acceptance rate.
      </p>
    </section>
  );
}
