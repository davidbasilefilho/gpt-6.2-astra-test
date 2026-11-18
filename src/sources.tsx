import { Accordion } from '@base-ui/react/accordion';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { useState } from 'react';

import { checkedAt, sources } from '../evidence.js';
import { ChoiceField, TextField } from './design/forms';
import { UiIcon } from './design/icons';
import { timing, easeEnter, easeExit } from './design/motion';
import { cn, controlVariants } from './design/variants';
import { filterSources } from './evidence-filter.js';
import { ExternalMark, Page, SourceLink, type Source } from './shared';
const sourceTypes = ['All', 'Official', 'Independent'] as const;
type SourceType = (typeof sourceTypes)[number];
export default function Sources() {
  const reduced = useReducedMotion();
  const [filter, setFilter] = useState<SourceType>('All');
  const [query, setQuery] = useState('');
  const filtered: Source[] = filterSources(sources, filter, query);
  return (
    <Page
      kind="sources"
      title="Sources"
      intro="The launch reports, benchmarks, pricing and safety evidence behind this guide. Open an entry to see what it supports and how we checked it."
    >
      <div className="atlas-source-tools">
        <ChoiceField
          label="Source type"
          value={filter}
          onValueChange={setFilter}
          options={sourceTypes.map((value) => ({ value, label: value }))}
        />
        <TextField
          label="Search sources"
          type="search"
          placeholder="Author, title or topic"
          value={query}
          onValueChange={setQuery}
        />
      </div>
      <output className="atlas-result-count">
        {filtered.length} {filtered.length === 1 ? 'source' : 'sources'} · Checked {checkedAt}
      </output>
      <Accordion.Root className="atlas-source-list" multiple>
        <AnimatePresence initial={false}>
          {filtered.map((source: Source) => (
            <motion.div
              key={source.id}
              initial={reduced ? false : { opacity: 0 }}
              animate={{
                opacity: 1,
                transition: { duration: reduced ? 0 : timing.enter, ease: easeEnter },
              }}
              exit={{
                opacity: 0,
                height: 0,
                overflow: 'hidden',
                transition: { duration: reduced ? 0 : timing.fast, ease: easeExit },
              }}
            >
              <Accordion.Item className="atlas-source" key={source.id} value={source.id}>
                <Accordion.Header>
                  <Accordion.Trigger
                    className={cn(
                      controlVariants({ variant: 'ghost', tone: 'neutral', size: 'lg' }),
                      'atlas-source-trigger',
                    )}
                  >
                    <span>
                      <span className="atlas-source-meta">
                        {source.author} / {source.type}
                      </span>
                      <span className="atlas-source-title">{source.title}</span>
                    </span>
                    <UiIcon name="plus" className="atlas-source-plus" />
                  </Accordion.Trigger>
                </Accordion.Header>
                <Accordion.Panel className="ds-disclosure">
                  <div className="atlas-source-panel">
                    <p>{source.summary}</p>
                    <p className="atlas-caveat">{source.caveat}</p>
                    <dl>
                      <dt>Verification</dt>
                      <dd>{source.verification}</dd>
                      <dt>Source date</dt>
                      <dd>{source.date}</dd>
                    </dl>
                    <SourceLink id={source.id}>Open original source</SourceLink>
                    {source.mirrorUrl ? (
                      <a
                        className="atlas-reference atlas-mirror"
                        href={source.mirrorUrl}
                        target="_blank"
                        rel="noreferrer"
                      >
                        Public mirror <ExternalMark />
                      </a>
                    ) : null}
                  </div>
                </Accordion.Panel>
              </Accordion.Item>
            </motion.div>
          ))}
        </AnimatePresence>
      </Accordion.Root>
      {filtered.length === 0 ? (
        <p className="atlas-empty">No matching sources. Try another name or clear your search.</p>
      ) : null}
      <aside className="atlas-method">
        <h2>How we checked the sources</h2>
        <p>
          Official pages were read directly. For social posts that could not be opened directly on
          X, we checked supplied captures and public mirrors. Each entry names the verification
          method.
        </p>
        <p>
          We reviewed only the public introduction of Every’s subscriber-only review. Its full
          subscriber-only text is not part of our assessment.
        </p>
      </aside>
    </Page>
  );
}
