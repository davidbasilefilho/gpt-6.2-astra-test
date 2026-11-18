import { motion, useReducedMotion } from 'motion/react';
import { useEffect, type ReactNode } from 'react';

import { sources } from '../evidence.js';
import { timing } from './design/motion';

export type Source = (typeof sources)[number];
export const sourceById = Object.fromEntries(sources.map((source) => [source.id, source]));
export function ExternalMark() {
  return (
    <svg
      className="ds-external"
      viewBox="0 0 16 16"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
    >
      <path d="M3 13L12 4M4 4h8v8" />
    </svg>
  );
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
  const reduced = useReducedMotion();
  useEffect(() => {
    document.querySelector<HTMLElement>('.atlas-page h1')?.focus({ preventScroll: true });
  }, []);
  return (
    <motion.main
      className={`atlas-page frame atlas-sheet-${kind}`}
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: reduced ? 0 : timing.enter }}
    >
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
    </motion.main>
  );
}
