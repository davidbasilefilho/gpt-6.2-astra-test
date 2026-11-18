import { Markdown } from '@tanstack/markdown/react';
import { Link } from '@tanstack/react-router';

import { UiIcon } from './design/icons';
import { SafetyCard } from './safety-card';
import { Page, SourceLink, sourceById } from './shared';
import { testerNotes } from './tester-notes';
export default function FieldNotes() {
  return (
    <Page
      kind="notes"
      title="Field notes"
      intro={
        <Markdown>
          {
            'Before the November 17 release, early testers found genuine strengths and frustrating failures. [OpenAI reported late changes](#tibo); Theo Browne said they helped, but did not change his recommendation.'
          }
        </Markdown>
      }
    >
      <div className="atlas-voices">
        {['theo', 'dan', 'matt', 'tibo'].map((id) => {
          const source = sourceById[id];
          return (
            <article className="atlas-voice" id={id} key={id}>
              <div className="atlas-voice-byline">
                <h2>{source.author}</h2>
                <span>{source.type}</span>
              </div>
              <div className="atlas-voice-copy">
                <h3>{source.title}</h3>
                {testerNotes[id].map((paragraph) => (
                  <p key={paragraph.slice(0, 32)}>{paragraph}</p>
                ))}
                <SourceLink id={id}>Read the original</SourceLink>
                {id === 'theo' ? (
                  <a
                    className="atlas-reference atlas-mirror"
                    href="https://www.nitter.gq/thsottiaux/status/2122929634916679820"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Follow-up exchange
                  </a>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
      <SafetyCard />
      <div className="atlas-next">
        <Link to="/sources">
          Inspect the sources <UiIcon name="arrow-up-right" />
        </Link>
      </div>
    </Page>
  );
}
