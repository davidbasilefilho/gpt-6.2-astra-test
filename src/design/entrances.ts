import { animate, inView } from 'motion';

import { easeEnter, timing } from './motion';

// No pre-hidden content: print, fragment navigation and unavailable observers still read normally.
// Animate the printed elements, never the scroll container or any popover's coordinate system.
export function watchEntrances(scope: Element) {
  // On client navigation, the old/new route snapshots own the screen first.
  // Don't spend the in-view reveal behind a still snapshot or fade the entire page twice.
  let stopped = false,
    frame = 0;
  let cleanup = () => {};
  const begin = () => {
    if (!stopped && scope.isConnected) cleanup = observeContent(scope);
  };
  const wait = () => {
    if (stopped) return;
    const transition = 'activeViewTransition' in document ? document.activeViewTransition : null;
    if (
      transition &&
      typeof transition === 'object' &&
      'finished' in transition &&
      transition.finished instanceof Promise
    ) {
      void transition.finished.then(begin, begin);
      return;
    }
    if (
      window.CSS?.supports('selector(:active-view-transition)') &&
      document.documentElement.matches(':active-view-transition')
    ) {
      frame = requestAnimationFrame(wait);
      return;
    }
    begin();
  };
  frame = requestAnimationFrame(wait);
  return () => {
    stopped = true;
    cancelAnimationFrame(frame);
    cleanup();
  };
}
function observeContent(scope: Element) {
  if (typeof IntersectionObserver === 'undefined') return () => {};
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const active = new Map<Element, ReturnType<typeof animate>>();
  const stops: (() => void)[] = [];
  const add = (selector: string, mode: 'plate' | 'rule' | 'ink') => {
    scope.querySelectorAll<HTMLElement>(selector).forEach((el, index) => {
      const stop = inView(
        el,
        () => {
          if (reduced.matches || el.contains(document.activeElement)) return;
          const rect = el.getBoundingClientRect();
          const lower = rect.top + rect.height / 2 > innerHeight / 2;
          const leading = getComputedStyle(el).direction === 'rtl' ? 'right' : 'left';
          const origin =
            mode === 'rule' ? leading + ' center' : leading + (lower ? ' bottom' : ' top');
          el.style.transformOrigin = origin;
          const lift = lower ? 1 : -1;
          const style =
            mode === 'rule'
              ? { scaleX: [0.05, 1] }
              : mode === 'plate'
                ? {
                    clipPath: [lower ? 'inset(12% 0 0 0)' : 'inset(0 0 12% 0)', 'inset(0 0 0% 0)'],
                    opacity: [0.72, 1],
                    y: [lift * 6, 0],
                  }
                : { opacity: [0.65, 1], y: [lift * 5, 0] };
          const animation = animate(el, style, {
            duration: mode === 'ink' ? timing.enter : timing.disclose,
            ease: easeEnter,
            delay: mode === 'plate' ? Math.min(index, 1) * 0.045 : 0,
          });
          active.set(el, animation);
          void animation.then(() => active.delete(el));
        },
        { amount: 'some' },
      );
      stops.push(stop);
    });
  };
  add('.atlas-model, .spread-grid > article', 'plate');
  add(
    '.atlas-section-head, .atlas-table tbody tr, .atlas-voice-byline, .study-row h3, .atlas-method h2, .reading-list > a',
    'ink',
  );
  add('.benchmark-bar', 'rule');
  const finish = (event: Event) =>
    active.forEach((motion, el) => {
      if (reduced.matches || (event.target instanceof Node && el.contains(event.target)))
        motion.complete();
    });
  scope.addEventListener('focusin', finish);
  reduced.addEventListener('change', finish);
  return () => {
    stops.forEach((stop) => stop());
    active.forEach((motion) => motion.complete());
    active.clear();
    reduced.removeEventListener('change', finish);
    scope.removeEventListener('focusin', finish);
  };
}
