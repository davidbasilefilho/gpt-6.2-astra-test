import { Link } from '@tanstack/react-router';
import { motion, useReducedMotion } from 'motion/react';
import { useEffect } from 'react';

import { checkedAt, editorialNote, sources } from '../evidence.js';
export type Source = (typeof sources)[number];
export const sourceById = Object.fromEntries(sources.map((source) => [source.id, source]));
export function SourceLink({ id, children }: { id: string; children?: React.ReactNode }) {
  const source = sourceById[id];
  return (
    <a className="atlas-reference" href={source.url} target="_blank" rel="noreferrer">
      {children ?? source.author}
      <span aria-hidden="true"> ↗</span>
    </a>
  );
}

export function Page({
  chapter,
  title,
  intro,
  children,
}: {
  chapter: string;
  title: string;
  intro: string;
  children: React.ReactNode;
}) {
  const reduced = useReducedMotion();
  useEffect(() => {
    document.querySelector<HTMLElement>('.atlas-page h1')?.focus({ preventScroll: true });
  }, []);
  return (
    <motion.main
      className="atlas-page"
      initial={reduced ? false : { opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
    >
      <div className="atlas-page-top">
        <Link to="/" className="atlas-back">
          ← Back to the atlas
        </Link>
        <span className="atlas-chapter">{chapter}</span>
      </div>
      <header className="atlas-page-heading">
        <h1 tabIndex={-1}>{title}</h1>
        <p>{intro}</p>
      </header>
      {children}
      <div className="atlas-endnote">
        <span className="atlas-star" aria-hidden="true">
          ✳
        </span>
        <p>{editorialNote}</p>
        <span>Checked {checkedAt}</span>
      </div>
    </motion.main>
  );
}
