import { useState } from 'react';

import { rateFor, tiers } from './api-rates.js';
import { ChoiceField } from './design/forms';
import { ScrollableLedger } from './design/scrollable-ledger';
import { Cite } from './study-components';
export function ApiAccess() {
  const [model, setModel] = useState('Sol');
  const [longContext, setLong] = useState(false);
  return (
    <>
      <section className="atlas-study" id="api">
        <h2>API access and rates</h2>
        <p className="study-lede">
          Both models are available in the API, with usage metered separately from ChatGPT. Prices
          below are US dollars per million tokens. Choose a model and context length to compare
          processing tiers. Eligible Pro accounts can activate a separate monthly API credit grant;
          it is not the Work allowance.
        </p>
        <div className="ds-pricing-controls">
          <ChoiceField
            label="Model"
            value={model}
            onValueChange={setModel}
            options={['Sol', 'Astra'].map((value) => ({ value, label: value }))}
          />
          <ChoiceField
            label="Input context"
            value={longContext ? 'long' : 'short'}
            onValueChange={(value) => setLong(value === 'long')}
            options={[
              { value: 'short', label: 'Up to 272K' },
              { value: 'long', label: 'Over 272K' },
            ]}
          />
        </div>
        <ScrollableLedger className="study-rate-table" label="Token prices">
          <table>
            <caption>
              {model} · {longContext ? 'long' : 'short'} context · USD per 1M
            </caption>
            <thead>
              <tr>
                {[
                  'Processing tier',
                  'Input',
                  'Cached read',
                  'Write · 30m',
                  'Write · 12h',
                  'Output',
                ].map((h) => (
                  <th scope="col" key={h}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {tiers.map((t) => (
                <tr key={t.label}>
                  <th scope="row">{t.label}</th>
                  {rateFor(model, t.factor, longContext).map((n: number, i: number) => (
                    <td key={i}>
                      {new Intl.NumberFormat('en-US', {
                        style: 'currency',
                        currency: 'USD',
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 3,
                      }).format(n)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollableLedger>
        <p className="atlas-caveat">
          Above 272,000 input tokens, the higher rate applies to the whole request. Ultrafast launch
          rates last through February 28, 2027 (Pacific); list rates start March 1. Background
          windows require eligible requests. Flex is not listed for these models. Tool use can add
          charges; eligible regional and FedRAMP endpoints add 10%.
        </p>
        <Cite href="https://developers.openai.com/api/docs/pricing">OpenAI pricing</Cite>{' '}
        <Cite href="https://developers.openai.com/api/docs/models/gpt-6.2-sol">Sol model card</Cite>{' '}
        <Cite href="https://developers.openai.com/api/docs/models/gpt-6.2-astra">
          Astra model card
        </Cite>
      </section>
      <section className="atlas-study" id="daybreak">
        <h2>Daybreak access</h2>
        <p className="study-lede">
          Daybreak is a vetted cybersecurity access program, not another subscription or a way to
          obtain a model your account does not include.
        </p>
        <div className="study-row">
          <h3>Blue</h3>
          <div>
            <p>
              For GPT-6.2 Sol and Astra, Blue alone leaves the standard safeguards in place. Other
              models, including GPT-6 Sol and GPT-6 Luna, have different Blue eligibility.
            </p>
          </div>
        </div>
        <div className="study-row">
          <h3>Red</h3>
          <div>
            <p>
              Reduced refusals for authorized defensive work on either 6.2 model require Red
              approval, model entitlement and Daybreak enabled in the relevant workspace or project.
              Access to the specialized GPT-6 Cyber model requires separate approval.
            </p>
          </div>
        </div>
        <Cite href="https://help.openai.com/en/articles/20001259-troubleshooting-openai-daybreak">
          6.2 eligibility
        </Cite>{' '}
        <Cite href="https://help.openai.com/en/articles/20001258-openai-daybreak-trusted-access-for-cyber-overview">
          Daybreak program
        </Cite>
      </section>
    </>
  );
}
