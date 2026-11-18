import { ScrollArea } from '@base-ui/react/scroll-area';
import type { ReactNode } from 'react';

import { cn } from './variants';

export function ScrollableLedger({
  label,
  children,
  className = '',
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <ScrollArea.Root className={cn('ds-scroll-ledger', className)}>
      <ScrollArea.Viewport className="ds-ledger-viewport" render={<section />} aria-label={label}>
        <ScrollArea.Content>{children}</ScrollArea.Content>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className="ds-ledger-bar" orientation="horizontal">
        <ScrollArea.Thumb className="ds-ledger-thumb" />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  );
}
