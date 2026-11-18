import { Page, SourceLink } from './shared';
export default function Access() {
  return (
    <Page
      chapter="04 / ACCESS"
      title="A subscription. A place to work."
      intro="For these models, the distinction is not just which plan you have. It is where you are using it."
    >
      <section className="atlas-access-hero">
        <div className="atlas-access-number" aria-hidden="true">
          ↗
        </div>
        <div>
          <h2>
            Work and Codex.
            <br />
            Not regular Chat.
          </h2>
          <p>
            The documented GPT-6.2 rollout is in ChatGPT Work and Codex. Seeing a subscription on
            your account does not mean the models appear in every ChatGPT surface.
          </p>
          <SourceLink id="access">Check the current access guide</SourceLink>
        </div>
      </section>
      <div className="atlas-access-steps">
        <section>
          <span>01</span>
          <h2>Check the plan</h2>
          <p>
            Eligible subscriptions include Plus, Pro, Business, Enterprise and Edu. Availability
            also depends on the rollout and workspace permissions.
          </p>
        </section>
        <section>
          <span>02</span>
          <h2>Check the surface</h2>
          <p>
            Open Work or Codex and inspect the model options available to your account. Workspace
            administrators may control what is enabled.
          </p>
        </section>
        <section>
          <span>03</span>
          <h2>Watch the allowance</h2>
          <p>
            Usage depends on task complexity and settings. Faster modes have separate eligibility
            and allowance rules. Check current account details before committing to a long run.
          </p>
        </section>
      </div>
      <aside className="atlas-pullquote">
        <p>Start with work you can verify. Upgrade for a need, not a launch-day promise.</p>
        <span>Editorial guidance, not a plan recommendation</span>
      </aside>
      <section className="atlas-prose atlas-access-foot">
        <h2>No timeless price table.</h2>
        <p>
          Plans, limits and rollout details can change. Rather than freeze a potentially misleading
          number here, we link to the official subscription documentation. This is a consumer guide;
          it does not cover API setup or billing.
        </p>
        <SourceLink id="access">Read current subscription details</SourceLink>
      </section>
    </Page>
  );
}
