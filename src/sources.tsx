import { Accordion } from '@base-ui/react/accordion';
import { useState } from 'react';

import { checkedAt, sources } from '../evidence.js';
import { filterSources } from './evidence-filter.js';
import { Page, SourceLink, type Source } from './shared';
const sourceTypes = ['All', 'Official', 'Independent'] as const;
type SourceType = (typeof sourceTypes)[number];
export default function Sources() {
  const [filter, setFilter] = useState<SourceType>('All');
  const [query, setQuery] = useState('');
  const filtered: Source[] = filterSources(sources, filter, query);
  return (
    <Page
      chapter="03 / THE READING ROOM"
      title="Keep the evidence close."
      intro="Original sources, the limits of what we could verify, and the distinction between a claim and an observation."
    >
      <div className="atlas-source-tools">
        <fieldset className="atlas-filter" aria-label="Filter sources">
          {sourceTypes.map((type) => (
            <button key={type} aria-pressed={type === filter} onClick={() => setFilter(type)}>
              {type}
            </button>
          ))}
        </fieldset>
        <label className="atlas-search">
          <span className="atlas-sr-only">Search sources</span>
          <input
            type="search"
            placeholder="Search the reading room"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </label>
      </div>
      <output className="atlas-result-count">
        {filtered.length} sources · last checked {checkedAt}
      </output>
      <Accordion.Root className="atlas-source-list" multiple>
        {filtered.map((source: Source) => (
          <Accordion.Item className="atlas-source" key={source.id} value={source.id}>
            <Accordion.Header>
              <Accordion.Trigger className="atlas-source-trigger">
                <span>
                  <span className="atlas-source-meta">
                    {source.author} / {source.type}
                  </span>
                  <span className="atlas-source-title">{source.title}</span>
                </span>
                <span className="atlas-source-plus" aria-hidden="true">
                  +
                </span>
              </Accordion.Trigger>
            </Accordion.Header>
            <Accordion.Panel className="atlas-source-panel">
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
                  Public mirror ↗
                </a>
              ) : null}
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion.Root>
      {filtered.length === 0 ? (
        <p className="atlas-empty">No matching sources. Try another name or clear your search.</p>
      ) : null}
      <aside className="atlas-method">
        <h2>A note on method</h2>
        <p>
          Official pages were read directly. Some social posts were checked using user-supplied
          captures and public mirrors because direct X retrieval was blocked. Each entry discloses
          the verification used. Paraphrases are ours; assessments remain attributed.
        </p>
        <p>
          We reviewed only the public introduction of Every’s subscriber-only review. No paywall was
          bypassed. This site contains no invented performance scores or claimed hands-on benchmark
          results.
        </p>
      </aside>
    </Page>
  );
}
