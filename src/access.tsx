import { Page, SourceLink } from './shared';
export default function Access() {
  return (
    <Page
      kind="access"
      title="Subscription access"
      intro="GPT-6.2 Sol and Astra are offered in ChatGPT Work and Codex, not regular Chat."
    >
      <div className="atlas-access-layout">
        <section className="atlas-plan">
          <h2>Eligible plans</h2>
          <p>
            Plus, Pro, Business, Enterprise and Edu. Rollout, region and workspace permissions can
            affect what appears in your account.
          </p>
          <SourceLink id="access">Check current subscription details</SourceLink>
        </section>
        <div className="atlas-access-steps">
          <section>
            <h2>Find the models</h2>
            <p>
              Open the model picker in Work or Codex. If the options are missing in a managed
              workspace, check with its administrator.
            </p>
          </section>
          <section>
            <h2>Check your allowance</h2>
            <p>
              Usage depends on the task and settings. Faster modes have separate eligibility and
              allowance rules. Check your account before starting a long run.
            </p>
          </section>
        </div>
      </div>
    </Page>
  );
}
