import { Popover } from '@base-ui/react/popover';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';

import { celestialPlacement, celestialDepth, anchoredRect } from './celestial-geometry.js';
import { cn } from './variants';

import './celestial.css';

type Body = 'sol' | 'astra' | 'luna' | 'terra';
type Selection = { body: Body; trigger: string } | null;
const descriptions = {
  sol: 'OpenAI’s model for everyday professional work.',
  astra: 'OpenAI’s model for harder professional projects.',
  luna: 'A quieter orbit. A name glimpsed in the dark.',
  terra: 'A familiar world, glimpsed from farther out.',
};

/** Base UI is the sole owner of popup ARIA, dismissal, safe hover and exit mounting. */
export function CelestialPopover({
  body,
  selection,
  select,
}: {
  body: Body;
  selection: Selection;
  select: (selection: Selection, closingBody?: Body) => void;
}) {
  const wrapper = useRef<HTMLDivElement>(null);
  const popup = useRef<HTMLDivElement>(null);
  const positioner = useRef<HTMLDivElement>(null);
  const frameRef = useRef<() => void>(() => {});
  const bindPositioner = useCallback((element: HTMLDivElement | null) => {
    positioner.current = element;
    frameRef.current();
  }, []);
  const [side, setSide] = useState<'top' | 'bottom'>('bottom');
  const [lastTrigger, setLastTrigger] = useState(`${body}-trigger-0`);
  const dismissed = useRef<string | null>(null);
  const lastMouse = useRef(0);
  const restoreEscapeFocus = useRef(false);
  const fixedAnchor = useRef<{
    id: string;
    left: number;
    top: number;
    width: number;
    height: number;
  } | null>(null);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const open = selection?.body === body;
  const active = open ? selection.trigger : lastTrigger;
  const name = body[0].toUpperCase() + body.slice(1);
  const [mounted, setMounted] = useState(false);
  useLayoutEffect(() => {
    const root = wrapper.current;
    if (!root) return undefined;
    const plate = root.closest('.plate');
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    const neutral = () => {
      pointer.current = null;
    };
    const move = (event: PointerEvent) => {
      if (event.pointerType === 'mouse') lastMouse.current = Date.now();
      pointer.current =
        event.pointerType === 'mouse' && fine.matches && !reduced.matches
          ? { x: event.clientX, y: event.clientY }
          : null;
    };
    const down = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') neutral();
    };
    const frame = () => {
      const bounds = root.getBoundingClientRect();
      if (!bounds.width) return;
      root
        .querySelectorAll<HTMLElement>('[data-constellation], [data-orbit]')
        .forEach((trigger) => {
          const art =
            trigger.dataset.constellation !== undefined
              ? plate?.querySelector(`[data-constellation-art="${trigger.dataset.constellation}"]`)
              : document.getElementById(trigger.dataset.orbit!);
          if (!art) return;
          const rect = art.getBoundingClientRect();
          trigger.style.left = `${rect.left + rect.width / 2 - bounds.left}px`;
          trigger.style.top = `${rect.top + rect.height / 2 - bounds.top}px`;
          if (trigger.dataset.constellation !== undefined) {
            trigger.style.width = `${Math.max(44, rect.width + 24)}px`;
            trigger.style.height = `${Math.max(44, rect.height + 24)}px`;
          }
        });
      const panel = popup.current;
      const layer = positioner.current;
      const trigger = document.getElementById(active);
      if (!panel || !layer || !trigger) return;
      // Hold the destination still for the whole disclosure. Only viewport/scroll
      // changes may move it; the painted orbit and its trigger continue autonomously.
      const liveAnchor = trigger.getBoundingClientRect();
      if (!fixedAnchor.current || fixedAnchor.current.id !== active) {
        fixedAnchor.current = {
          id: active,
          left: liveAnchor.left - bounds.left,
          top: liveAnchor.top - bounds.top,
          width: liveAnchor.width,
          height: liveAnchor.height,
        };
      }
      const fixed = fixedAnchor.current;
      const anchor = anchoredRect(fixed, bounds);
      const placement = celestialPlacement({
        body,
        anchor,
        bounds,
        width: panel.offsetWidth,
        height: panel.offsetHeight,
        viewportWidth: innerWidth,
        viewportHeight: innerHeight,
      });
      layer.style.setProperty('--celestial-x', `${placement.x}px`);
      layer.style.setProperty('--celestial-y', `${placement.y}px`);
      layer.style.setProperty('--overlay-origin', placement.origin);
      layer.dataset.ready = 'true';
      setSide(placement.side === 'top' ? 'top' : 'bottom');
      const sun = plate?.querySelector('.sun')?.getBoundingClientRect();
      const solar = sun
        ? { x: sun.left + sun.width / 2, y: sun.top + sun.height / 2 }
        : { x: bounds.left + bounds.width / 2, y: bounds.top + bounds.height / 2 };
      const angles = celestialDepth(
        pointer.current,
        solar,
        panel.getBoundingClientRect(),
        fine.matches && !reduced.matches && !!pointer.current,
      );
      panel.style.setProperty('--tilt-x', `${angles.x.toFixed(3)}deg`);
      panel.style.setProperty('--tilt-y', `${angles.y.toFixed(3)}deg`);
      panel.style.setProperty('--tilt-z', `${angles.z.toFixed(3)}deg`);
      panel.style.setProperty('--depth', `${angles.depth}px`);
      panel.style.setProperty('--depth-origin', angles.origin);
    };
    frameRef.current = frame;
    document.addEventListener('atlas:sky-frame', frame);
    document.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerdown', down, true);
    document.addEventListener('keydown', neutral, true);
    plate?.addEventListener('pointerleave', neutral);
    reduced.addEventListener('change', neutral);
    fine.addEventListener('change', neutral);
    frame();
    return () => {
      document.removeEventListener('atlas:sky-frame', frame);
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerdown', down, true);
      document.removeEventListener('keydown', neutral, true);
      plate?.removeEventListener('pointerleave', neutral);
      reduced.removeEventListener('change', neutral);
      fine.removeEventListener('change', neutral);
    };
  }, [active, body]);

  return (
    <div
      ref={wrapper}
      className={cn(
        'celestial-focus celestial-base',
        body === 'sol' ? 'sol-focus' : body === 'astra' ? 'astra-focus' : 'orbit-focus',
      )}
      data-body={body}
      data-popup-mounted={mounted || open ? '' : undefined}
    >
      <Popover.Root
        open={open}
        triggerId={active}
        modal={false}
        onOpenChange={(next, details) => {
          const id = details.trigger?.id || active;
          restoreEscapeFocus.current = !next && details.reason === 'escape-key';
          if (next && details.reason === 'trigger-hover' && Date.now() - lastMouse.current > 250) {
            details.cancel();
            return;
          }
          if (next) {
            if (!open || active !== id) fixedAnchor.current = null;
            dismissed.current = null;
            setLastTrigger(id);
            setMounted(true);
            select({ body, trigger: id });
          } else {
            dismissed.current = id;
            if (open) select(null, body);
          }
        }}
        onOpenChangeComplete={(next) => {
          if (!next) setMounted(false);
        }}
      >
        {Array.from({ length: body === 'astra' ? 2 : 1 }, (_, index) => (
          <Popover.Trigger
            key={index}
            id={`${body}-trigger-${index}`}
            className={cn(
              'planet-target',
              body === 'astra' ? 'constellation-target' : body !== 'sol' && 'orbit-target',
            )}
            data-constellation={body === 'astra' ? index : undefined}
            data-orbit={
              body === 'luna' ? 'orbiter-near' : body === 'terra' ? 'orbiter-far' : undefined
            }
            aria-label={`About ${name}${body === 'astra' ? (index === 0 ? ', northern constellation' : ', southern constellation') : ''}`}
            openOnHover
            delay={0}
            closeDelay={400}
            onFocus={(event) => {
              if (dismissed.current !== event.currentTarget.id) dismissed.current = null;
              if (
                event.currentTarget.matches(':focus-visible') &&
                dismissed.current !== event.currentTarget.id
              ) {
                if (!open || active !== event.currentTarget.id) fixedAnchor.current = null;
                setMounted(true);
                setLastTrigger(event.currentTarget.id);
                select({ body, trigger: event.currentTarget.id });
              }
            }}
            onBlur={(event) => {
              if (event.relatedTarget !== null && !wrapper.current?.contains(event.relatedTarget))
                dismissed.current = null;
            }}
          />
        ))}
        <Popover.Portal container={wrapper}>
          <Popover.Positioner
            ref={bindPositioner}
            className="celestial-positioner"
            side={side}
            sideOffset={8}
            collisionAvoidance={{ side: 'none', align: 'none' }}
            disableAnchorTracking
          >
            <Popover.Popup
              ref={popup}
              className="body-popover celestial-popup"
              id={`${body}-popover`}
              initialFocus={false}
              finalFocus={() =>
                restoreEscapeFocus.current ? document.getElementById(active) : false
              }
            >
              <div className="popover-surface ds-overlay">
                <Popover.Title>{name}</Popover.Title>
                <Popover.Description>{descriptions[body]}</Popover.Description>
                {body === 'sol' || body === 'astra' ? (
                  <a href="/compare">Compare the models</a>
                ) : (
                  <p className="illustration-note">
                    An illustrated presence, not a GPT-6.2 announcement.
                  </p>
                )}
              </div>
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}

export function CelestialPlateControls() {
  const [selection, setSelection] = useState<Selection>(null);
  const select = useCallback((next: Selection, closingBody?: Body) => {
    setSelection((previous) =>
      !next && closingBody && previous?.body !== closingBody ? previous : next,
    );
  }, []);
  useLayoutEffect(() => {
    const plate = document.querySelector<HTMLElement>('.plate');
    if (plate) {
      plate.dataset.observe = selection?.body || 'overview';
      plate.dataset.constellation =
        selection?.body === 'astra' ? selection.trigger.split('-').at(-1)! : '';
    }
  }, [selection]);
  return (
    <>
      {(['sol', 'astra', 'luna', 'terra'] as const).map((body) => (
        <CelestialPopover key={body} body={body} selection={selection} select={select} />
      ))}
    </>
  );
}
