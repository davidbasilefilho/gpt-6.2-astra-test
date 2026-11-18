import { useReducedMotion } from 'motion/react';
import { Activity, startTransition, useState, ViewTransition } from 'react';

import { Cite } from './study-components';
import { estimateTasks } from './task-value.js';
const initial = { quota: '', success: '', fresh: '', cached: '', output: '' };
const fields = [
  ['quota', 'Weekly allowance used per attempt (%)'],
  ['success', 'Attempts accepted (%)'],
  ['fresh', 'Fresh input tokens per attempt'],
  ['cached', 'Cache-read tokens per attempt'],
  ['output', 'Billed output tokens per attempt'],
] as const;
function Worksheet({ name, rates }: { name: string; rates: number[] }) {
  const [inputs, setInputs] = useState(initial);
  const result = estimateTasks(inputs, rates);
  const dollars = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  });
  return (
    <fieldset className="study-worksheet">
      <legend>{name}</legend>
      {fields.map(([key, label]) => (
        <label key={key}>
          {label}
          <input
            type="number"
            inputMode="decimal"
            min={key === 'quota' ? 0.01 : 0}
            max={key === 'quota' || key === 'success' ? 100 : undefined}
            step="any"
            placeholder="Enter value"
            value={inputs[key]}
            onChange={(e) => setInputs({ ...inputs, [key]: e.target.value })}
          />
        </label>
      ))}
      <output aria-live="polite">
        {result ? (
          <>
            <b>{result.complete.toFixed(1)} completed / week</b>
            <span>
              {dollars.format(result.perAttempt)} per attempt · {dollars.format(result.weeklyCost)}{' '}
              weekly API equivalent
            </span>
          </>
        ) : (
          <span>Enter all five observations to estimate this workload.</span>
        )}
      </output>
    </fieldset>
  );
}
export function SubscriptionValue() {
  const [worksheet, setWorksheet] = useState(0);
  const reduced = useReducedMotion();
  return (
    <section id="value" className="atlas-study">
      <h2>What does $200 buy?</h2>
      <p className="study-lede">
        ChatGPT Pro and Claude Ultra each cost $200 a month at these tiers. Neither sells a fixed
        number of completed tasks. A dollar of estimated API usage is not a dollar of cash, compute
        cost or provider subsidy.
      </p>
      <div className="study-row">
        <h3>Compare the limits</h3>
        <div>
          <p>
            ChatGPT Pro has a weekly Work/Codex allowance without a five-hour cap. Claude Ultra
            includes 10× Claude Pro’s weekly usage; verified subscribers have no five-hour cap, but
            Fable still has a separate limit. The two providers’ meters are not interchangeable.
          </p>
          <Cite href="https://help.openai.com/en/articles/20001516-managing-usage-with-gpt-6-astra-in-work-and-codex">
            OpenAI usage
          </Cite>{' '}
          <Cite href="https://support.claude.com/en/articles/17728952-what-is-the-ultra-plan">
            Claude Ultra
          </Cite>
        </div>
      </div>
      <div className="study-row">
        <h3>Separate real credits</h3>
        <div>
          <p>
            Both $200 plans also offer a separate $200 monthly API credit grant after eligibility
            and activation. Credits expire rather than rolling over. These are not additional
            subscription tasks; keep them out of modeled usage value.
          </p>
          <Cite href="https://developers.openai.com/api/docs/guides/chatgpt-api-credits">
            OpenAI credit terms
          </Cite>{' '}
          <Cite href="https://support.claude.com/en/articles/17154008-monthly-api-credits-for-max-ultra-and-team-plans">
            Claude credit terms
          </Cite>
        </div>
      </div>
      <div className="study-row">
        <h3>What independent estimates can tell us</h3>
        <div>
          <p id="pricing-history">
            SemiAnalysis’s October 5 study priced a fully used GPT-6 Astra allowance at about $2,897
            in API usage; roughly half the compared Claude allowance represented $2,485 of Fable 5.1
            usage. Those are older models and quotas. OpenAI changed Pro allowances on October 29;
            neither number is a current 6.2 versus Ultra entitlement.
          </p>
          <Cite href="https://newsletter.semianalysis.com/p/anthropic-subscriptions-offer-5x">
            Historical comparison
          </Cite>{' '}
          <Cite href="https://help.openai.com/en/articles/9793128-about-chatgpt-pro-tiers">
            October quota revision
          </Cite>
          <p>
            MyPriors’ 6.2 Astra estimate assumes the previous Astra quota and a mix of 97% cache
            reads, 2.5% fresh input and 0.5% output. Its $0.788 API versus $0.063 subscription
            estimate per million mixed tokens is for Pro 10× ($100), not Pro 20× ($200). We found no
            comparable measurement of weekly 6.2 versus Fable 5.2 completions on the two $200 plans.
          </p>
          <Cite href="https://mypriors.com/models/gpt-6.2-astra?r=aa">
            Inspect the MyPriors assumptions
          </Cite>
        </div>
      </div>
      <h3 className="study-subhead">Estimate completed work in your week</h3>
      <p>
        Run the same task on both plans. Average the quota and billed tokens across all attempts,
        including retries and failures. Supply averages for each model separately. Use the binding
        model-specific weekly meter; enter billed output including reasoning where applicable.
      </p>
      <div className="study-pricing-controls">
        <fieldset>
          <legend>Workload to estimate</legend>
          {['ChatGPT Pro', 'Claude Ultra'].map((name, i) => (
            <label key={name}>
              <input
                type="radio"
                name="worksheet-plan"
                checked={worksheet === i}
                onChange={() => startTransition(() => setWorksheet(i))}
              />
              {name}
            </label>
          ))}
        </fieldset>
      </div>
      <div className="study-worksheets">
        <ViewTransition default={reduced ? 'none' : 'auto'}>
          <div>
            <Activity mode={worksheet === 0 ? 'visible' : 'hidden'}>
              <Worksheet name="GPT-6.2 Astra · Pro $200" rates={[8, 0.4, 40]} />
            </Activity>
            <Activity mode={worksheet === 1 ? 'visible' : 'hidden'}>
              <Worksheet name="Claude Fable 5.2 · Ultra $200" rates={[8, 0.2, 40]} />
            </Activity>
          </div>
        </ViewTransition>
      </div>
      <p className="atlas-caveat">
        Expected completions = 100 ÷ percent of weekly quota per attempt × acceptance rate. Weekly
        API equivalent prices all attempts at Standard short-context rates; it excludes cache
        writes, tools, promotions, taxes and other caps. Do not use it as a promised capacity.
      </p>
      <Cite href="https://developers.openai.com/api/docs/models/gpt-6.2-astra">Astra rates</Cite>{' '}
      <Cite href="https://platform.claude.com/docs/en/models/fable-5-2/whats-new-fable-5-2">
        Claude rates
      </Cite>
    </section>
  );
}
