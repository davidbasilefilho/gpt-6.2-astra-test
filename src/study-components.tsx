import type { ReactNode } from 'react';

import { ExternalMark } from './shared';
export function Cite({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a className="atlas-reference study-cite" href={href} target="_blank" rel="noreferrer">
      {children}
      <ExternalMark />
    </a>
  );
}
