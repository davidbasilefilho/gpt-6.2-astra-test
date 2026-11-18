import { Markdown } from '@tanstack/markdown/react';
import { Link } from '@tanstack/react-router';
import { motion, useReducedMotion } from 'motion/react';
import { Activity, startTransition, useState, ViewTransition } from 'react';

import { fieldTest } from '../evidence.js';
import { ActionButton, DisclosureMark } from './design/components';
import { timing, easeEnter, easeExit } from './design/motion';
import { Page, SourceLink, sourceById } from './shared';
export default function FieldNotes() {
  const [showTest, setShowTest] = useState(false);
  const [awake, setAwake] = useState(false);
  const [checks, setChecks] = useState<boolean[]>(() => fieldTest.map(() => false));
  const reduced = useReducedMotion();
  return (
    <Page
      kind="notes"
      title="Field notes"
      intro={
        <Markdown>
          {
            'Early testers praised Astra’s code review but reported stalled runs and hard-to-follow explanations. [OpenAI’s response](#tibo) points to changes shortly before launch.'
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
                <p>{source.summary}</p>
                <p className="atlas-caveat">{source.caveat}</p>
                <SourceLink id={id}>Read the original</SourceLink>
              </div>
            </article>
          );
        })}
      </div>
      <section className="atlas-safety-note">
        <h2>What the system card found</h2>
        <p>{sourceById['system-card'].summary}</p>
        <p className="atlas-caveat">{sourceById['system-card'].caveat}</p>
        <SourceLink id="system-card">Read the system card</SourceLink>
      </section>
      <section className="atlas-test">
        <div>
          <h2>Try a task of your own</h2>
        </div>
        <ActionButton
          variant="primary"
          className="atlas-button"
          aria-expanded={showTest}
          aria-controls="field-checklist"
          onClick={() => {
            if (!showTest) setAwake(true);
            startTransition(() => setShowTest((value) => !value));
          }}
        >
          {showTest ? 'Close checklist' : 'Open checklist'} <DisclosureMark open={showTest} />
        </ActionButton>
        <motion.div
          id="field-checklist"
          className="checklist-frame"
          inert={!showTest}
          aria-hidden={!showTest}
          initial={false}
          animate={{ height: showTest ? 'auto' : 0, opacity: showTest ? 1 : 0 }}
          transition={{
            duration: reduced ? 0 : timing.disclose,
            ease: showTest ? easeEnter : easeExit,
          }}
          onAnimationComplete={() => {
            if (!showTest) setAwake(false);
          }}
        >
          <ViewTransition default={reduced ? 'none' : 'auto'}>
            <Activity mode={awake || showTest ? 'visible' : 'hidden'}>
              <div className="atlas-checklist">
                {fieldTest.map((item, index) => (
                  <label key={item}>
                    <input
                      type="checkbox"
                      checked={checks[index]}
                      onChange={() =>
                        setChecks((current) =>
                          current.map((value, i) => (i === index ? !value : value)),
                        )
                      }
                    />
                    <span>{item}</span>
                  </label>
                ))}
                <p aria-live="polite">
                  {checks.filter(Boolean).length} of {fieldTest.length} checks complete. Kept while
                  this page stays open.
                </p>
              </div>
            </Activity>
          </ViewTransition>
        </motion.div>
      </section>
      <div className="atlas-next">
        <Link to="/sources">
          Inspect the sources <span>↗</span>
        </Link>
      </div>
    </Page>
  );
}
