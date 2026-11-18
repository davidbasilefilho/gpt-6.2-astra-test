// Anchor route travel to the actual activating link. Pointer, keyboard and history
// have different origins; never infer a pointer position from a synthetic click.
export function bindRouteOrigins() {
  const root = document.documentElement;
  let sequence = 0;
  const map = (x: number, y: number) => {
    root.style.setProperty(
      '--route-origin-x',
      Math.max(0, Math.min(100, (x / Math.max(1, innerWidth)) * 100)) + '%',
    );
    root.style.setProperty(
      '--route-origin-y',
      Math.max(0, Math.min(1, y / Math.max(1, innerHeight))) * 100 + 'svh',
    );
    root.dataset.routeMotion = 'active';
    const id = ++sequence;
    window.setTimeout(() => {
      if (id === sequence) delete root.dataset.routeMotion;
    }, 1400);
  };
  document.addEventListener(
    'click',
    (e) => {
      if (
        !(e.target instanceof Element) ||
        e.button !== 0 ||
        e.altKey ||
        e.ctrlKey ||
        e.metaKey ||
        e.shiftKey
      )
        return;
      const a = e.target.closest<HTMLAnchorElement>('a[href]');
      if (!a || a.target || a.hasAttribute('download')) return;
      const url = new URL(a.href);
      if (url.origin !== location.origin || url.pathname === location.pathname || url.hash) return;
      const box = a.getBoundingClientRect();
      map(
        e.detail ? e.clientX : box.left + box.width / 2,
        e.detail ? e.clientY : box.top + box.height / 2,
      );
    },
    true,
  );
  window.addEventListener('popstate', () => map(innerWidth / 2, 0));
}
