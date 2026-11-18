import { useEffect, useRef, type ReactNode } from 'react';

import { sources } from '../evidence.js';
import { watchEntrances } from './design/entrances';
import { UiIcon } from './design/icons';

export type Source = (typeof sources)[number];
export const sourceById = Object.fromEntries(sources.map((source) => [source.id, source]));
export function ExternalMark() {
  return <UiIcon name="arrow-up-right" className="ds-external" />;
}
export function SourceLink({ id, children }: { id: string; children?: ReactNode }) {
  const source = sourceById[id];
  return (
    <a className="atlas-reference" href={source.url} target="_blank" rel="noreferrer">
      {children ?? source.author}
      <ExternalMark />
    </a>
  );
}

export function Page({
  kind,
  title,
  intro,
  children,
}: {
  kind: 'notes' | 'guide' | 'sources' | 'access';
  title: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  const scope = useRef<HTMLElement>(null);
  useEffect(() => {
    return scope.current ? watchEntrances(scope.current) : undefined;
  }, []);
  useEffect(() => {
    document.querySelector<HTMLElement>('.atlas-page h1')?.focus({ preventScroll: true });
  }, []);
  return (
    <main ref={scope} className={`atlas-page frame atlas-sheet-${kind}`}>
      <header className="atlas-page-heading">
        <div>
          <h1 tabIndex={-1}>{title}</h1>
          {intro && <div className="atlas-header-summary">{intro}</div>}
        </div>
        {kind === 'notes' ? (
          <div className="instrument" aria-hidden="true">
            <img src="/assets/field-telescope.webp" width="620" height="413" alt="" />
          </div>
        ) : null}
      </header>
      {children}
    </main>
  );
}
