import { Tooltip } from '@base-ui/react/tooltip';
import { useEffect, useId, useMemo, useRef, useState, type ReactNode } from 'react';

import './tooltip.css';

/** Attach a tooltip to existing static markup without replacing its menu/event ownership. */
export function AnchoredTooltip({ anchorId, children }: { anchorId: string; children: ReactNode }) {
  const id = useId();
  const anchor = useMemo(() => document.getElementById(anchorId), [anchorId]);
  const [open, setOpen] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dismissed = useRef(false);
  const pointerInside = useRef(false);
  const keyboardFocus = useRef(false);
  function clearTimer() {
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = null;
  }
  function close() {
    clearTimer();
    setOpen(false);
  }
  function leavePopup() {
    clearTimer();
    timer.current = setTimeout(() => {
      if (!pointerInside.current && !keyboardFocus.current) setOpen(false);
    }, 120);
  }
  useEffect(() => {
    const element = document.getElementById(anchorId);
    if (!element) return undefined;
    const cancelTimer = () => {
      if (timer.current !== null) clearTimeout(timer.current);
      timer.current = null;
    };
    const hide = () => {
      cancelTimer();
      setOpen(false);
    };
    const menuOpen = () => element.getAttribute('aria-expanded') === 'true';
    const show = (delay: number) => {
      cancelTimer();
      if (dismissed.current || menuOpen()) return;
      timer.current = setTimeout(() => {
        if (!dismissed.current && !menuOpen()) setOpen(true);
      }, delay);
    };
    const enter = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return;
      pointerInside.current = true;
      dismissed.current = false;
      show(450);
    };
    const leave = () => {
      pointerInside.current = false;
      cancelTimer();
      if (!keyboardFocus.current) timer.current = setTimeout(hide, 120);
    };
    const focus = () => {
      keyboardFocus.current = element.matches(':focus-visible');
      if (keyboardFocus.current && !dismissed.current) show(0);
    };
    const blur = () => {
      keyboardFocus.current = false;
      dismissed.current = false;
      hide();
    };
    const press = () => {
      dismissed.current = true;
      hide();
    };
    const key = (event: KeyboardEvent) => {
      if (event.key === 'Escape') press();
    };
    const observer = new MutationObserver(() => {
      if (menuOpen()) press();
    });
    observer.observe(element, { attributes: true, attributeFilter: ['aria-expanded'] });
    element.addEventListener('pointerenter', enter);
    element.addEventListener('pointerleave', leave);
    element.addEventListener('pointerdown', press);
    element.addEventListener('click', press);
    element.addEventListener('focus', focus);
    element.addEventListener('blur', blur);
    document.addEventListener('keydown', key);
    window.addEventListener('blur', hide);
    return () => {
      cancelTimer();
      observer.disconnect();
      element.removeEventListener('pointerenter', enter);
      element.removeEventListener('pointerleave', leave);
      element.removeEventListener('pointerdown', press);
      element.removeEventListener('click', press);
      element.removeEventListener('focus', focus);
      element.removeEventListener('blur', blur);
      document.removeEventListener('keydown', key);
      window.removeEventListener('blur', hide);
    };
  }, [anchorId]);
  useEffect(() => {
    if (!anchor || !open) return undefined;
    const existing = anchor.getAttribute('aria-describedby');
    anchor.setAttribute('aria-describedby', [existing, id].filter(Boolean).join(' '));
    return () => {
      const remaining = (anchor.getAttribute('aria-describedby') ?? '')
        .split(/\s+/)
        .filter((part) => part && part !== id)
        .join(' ');
      if (remaining) anchor.setAttribute('aria-describedby', remaining);
      else anchor.removeAttribute('aria-describedby');
    };
  }, [anchor, id, open]);
  return (
    <Tooltip.Root
      open={open}
      onOpenChange={(next) => {
        if (!next) close();
      }}
    >
      <Tooltip.Portal>
        <Tooltip.Positioner
          anchor={anchor}
          side="bottom"
          align="end"
          sideOffset={8}
          className="ds-tooltip-positioner"
        >
          <Tooltip.Popup
            id={id}
            role="tooltip"
            className="ds-tooltip"
            onPointerEnter={clearTimer}
            onPointerLeave={leavePopup}
          >
            {children}
          </Tooltip.Popup>
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
  );
}

export function AppearanceTooltip() {
  return <AnchoredTooltip anchorId="theme-trigger">Change appearance</AnchoredTooltip>;
}
