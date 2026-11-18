import { ApiAccess } from './api-access';
import { Page, SourceLink } from './shared';
import { Cite } from './study-components';
import { SubscriptionValue } from './subscription-value';

export default function Access() {
  return (
    <Page
      kind="access"
      title="Access & pricing"
      intro="Where to use Sol and Astra, what draws down your allowance, and how to compare the cost of finished work."
    >
      <nav className="study-index" aria-label="On this page">
        <a href="#subscription">Subscription</a>
        <a href="#value">The $200 comparison</a>
        <a href="#api">API pricing</a>
        <a href="#daybreak">Daybreak</a>
      </nav>
      <section id="subscription" className="atlas-access-layout">
        <div className="atlas-plan">
          <h2>Subscription access</h2>
          <p>
            Choose GPT-6.2 Sol or Astra in the model picker in ChatGPT Work or Codex, not regular
            Chat. Update the app and check workspace permissions if neither appears.
          </p>
          <SourceLink id="access">Model access and rollout</SourceLink>
        </div>
        <div className="atlas-access-steps">
          <section>
            <h2>Plans and allowances</h2>
            <p>
              Rollout covers Plus, Pro, Business, Enterprise, Edu and eligible Healthcare and
              FedRAMP workspaces. Work and Codex share an allowance. Longer inputs, more output,
              higher reasoning effort and speed settings change how quickly you use it.
            </p>
            <Cite href="https://help.openai.com/en/articles/9793128-about-chatgpt-pro-tiers">
              Pro tiers: $100, $200 and $500
            </Cite>
          </section>
          <section>
            <h2>Ultrafast is a separate choice</h2>
            <p>
              Pro $200 includes Sol Ultrafast in Codex, but not Astra Ultrafast. Pro $500 can use
              either; both draw included allowance at 6× Standard. Plus, Pro $100 and Business do
              not include Ultrafast. Eligible Enterprise and Edu organizations use workspace
              credits.
            </p>
            <SourceLink id="access">Speed and credit rules</SourceLink>
          </section>
        </div>
      </section>
      <SubscriptionValue />
      <ApiAccess />
      <p className="study-date">US pricing and plan rules checked November 18, 2026.</p>
    </Page>
  );
}
