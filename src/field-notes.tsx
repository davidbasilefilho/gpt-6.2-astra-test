import { Markdown } from '@tanstack/markdown/react';
import { Link } from '@tanstack/react-router';
import { useReducedMotion } from 'motion/react';
import { Activity, startTransition, useState, ViewTransition } from 'react';

import { fieldTest } from '../evidence.js';
import { Page, SourceLink, sourceById } from './shared';
export default function FieldNotes() {
  const [showTest, setShowTest] = useState(false);
  const [checks, setChecks] = useState<boolean[]>(() => fieldTest.map(() => false));
  const reduced = useReducedMotion();
  return (
    <Page
      chapter="02 / FIELD NOTES"
      title="The friction matters."
      intro="Launch claims describe capability. Working with a model reveals something else: the cost of getting to done."
    >
      <div className="atlas-prose atlas-opening">
        <Markdown>
          {
            'These are **attributed reports**, not our independent benchmarks. Early access, different tasks and late model changes make a clean verdict difficult. That is a reason to keep the evidence visible, not to erase the criticism.'
          }
        </Markdown>
      </div>
      <div className="atlas-voices">
        {['theo', 'dan', 'matt', 'tibo'].map((id, index) => {
          const source = sourceById[id];
          return (
            <article className="atlas-voice" key={id}>
              <div className="atlas-voice-index">0{index + 1}</div>
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
        <span className="atlas-chapter">READ THE FINE PRINT</span>
        <h2>Safety is part of the story.</h2>
        <p>{sourceById['system-card'].summary}</p>
        <p className="atlas-caveat">{sourceById['system-card'].caveat}</p>
        <SourceLink id="system-card">Read the system card</SourceLink>
      </section>
      <section className="atlas-test">
        <div>
          <h2>Run your own small test.</h2>
          <p>Five checks. One real task. A more useful answer than choosing a side.</p>
        </div>
        <button
          className="atlas-button"
          aria-expanded={showTest}
          aria-controls="field-checklist"
          onClick={() => startTransition(() => setShowTest((value) => !value))}
        >
          {showTest ? 'Close checklist −' : 'Open checklist +'}
        </button>
        <ViewTransition default={reduced ? 'none' : 'auto'}>
          <Activity mode={showTest ? 'visible' : 'hidden'}>
            <div className="atlas-checklist" id="field-checklist">
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
      </section>
      <div className="atlas-next">
        <Link to="/sources">
          Inspect the sources <span>↗</span>
        </Link>
      </div>
    </Page>
  );
}
