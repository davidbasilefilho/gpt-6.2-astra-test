import { Tooltip } from '@base-ui/react/tooltip';
import type { ReactNode } from 'react';

import './tooltip.css';

/** Compose onto an existing Base UI trigger; one DOM control owns both semantics. */
export function ControlTooltip({
  render,
  content,
  disabled = false,
}: {
  render: import('react').ReactElement;
  content: ReactNode;
  disabled?: boolean;
}) {
  return (
    <Tooltip.Root disabled={disabled}>
      <Tooltip.Trigger render={render} disabled={disabled} delay={450} closeDelay={120} />
      <Tooltip.Portal>
        <Tooltip.Positioner
          side="bottom"
          align="end"
          sideOffset={8}
          collisionPadding={8}
          className="ds-tooltip-positioner"
        >
          <Tooltip.Popup role="tooltip" className="ds-tooltip">
            {content}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}
