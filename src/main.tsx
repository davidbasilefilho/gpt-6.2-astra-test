import {
  createRootRoute,
  createRoute,
  createRouter,
  lazyRouteComponent,
  Outlet,
  RouterProvider,
  useRouterState,
} from '@tanstack/react-router';
import { useLayoutEffect } from 'react';
import { createRoot } from 'react-dom/client';

import { AppearanceControl } from './design/appearance';
import { CelestialPlateControls } from './design/celestial';
import { watchEntrances } from './design/entrances';
import { bindRouteOrigins } from './design/origins';

import './routes.css';
bindRouteOrigins();
let clientReady = false;
function RouteShell() {
  const path = useRouterState({
    select: (state) =>
      (state.matches.at(-1)?.pathname ?? state.location.pathname).replace(/\/$/, '') || '/',
  });
  const isHome = path === '/';
  useLayoutEffect(() => {
    clientReady = true;
    const landing = document.getElementById('landing');
    if (landing) landing.hidden = !isHome;
    document.body.dataset.route = isHome ? 'home' : path.slice(1);
    document.querySelectorAll<HTMLAnchorElement>('.mast nav a[href]').forEach((link) => {
      if (new URL(link.href).pathname === path) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
    document.title = `${path === '/compare' ? 'The guide' : path === '/field-notes' ? 'Field notes' : path === '/sources' ? 'Sources' : path === '/access' ? 'Access' : 'Sol & Astra'} · The Field Atlas`;
    if (isHome) {
      document.getElementById('content')?.focus({ preventScroll: true });
      if (landing) return watchEntrances(landing);
    }
    return undefined;
  }, [isHome, path]);
  return <Outlet />;
}

function NotFound() {
  return (
    <main className="atlas-page">
      <h1>Off the map.</h1>
      <p>That page is not part of this atlas.</p>
      <a href="/">Return home</a>
    </main>
  );
}
const rootRoute = createRootRoute({ component: RouteShell, notFoundComponent: NotFound });
const routeTree = rootRoute.addChildren([
  createRoute({ getParentRoute: () => rootRoute, path: '/', component: () => null }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/compare',
    component: lazyRouteComponent(() => import('./guide')),
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/field-notes',
    component: lazyRouteComponent(() => import('./field-notes')),
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/sources',
    component: lazyRouteComponent(() => import('./sources')),
  }),
  createRoute({
    getParentRoute: () => rootRoute,
    path: '/access',
    component: lazyRouteComponent(() => import('./access')),
  }),
]);
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
  defaultViewTransition: true,
  scrollRestoration: true,
  defaultPendingMs: 150,
  defaultPendingComponent: () => (
    <main className="atlas-page" aria-busy="true">
      <output>Opening the atlas…</output>
    </main>
  ),
});
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

// Native landing links stay useful before hydration and become client navigations after it.
document.addEventListener('click', (event) => {
  if (!clientReady) return;
  if (
    event.defaultPrevented ||
    event.button !== 0 ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey
  )
    return;
  if (!(event.target instanceof Element)) return;
  const link = event.target.closest<HTMLAnchorElement>('a[href]');
  if (!link || link.target || link.hasAttribute('download') || link.closest('#atlas-react-root'))
    return;
  const url = new URL(link.href);
  if (
    url.origin !== location.origin ||
    url.hash ||
    !['/', '/compare', '/field-notes', '/sources', '/access'].includes(url.pathname)
  )
    return;
  event.preventDefault();
  void router.navigate({ to: url.pathname });
});
const mount = document.getElementById('atlas-react-root');
if (mount) createRoot(mount).render(<RouterProvider router={router} />);
const appearance = document.getElementById('appearance-root');
if (appearance) createRoot(appearance).render(<AppearanceControl />);
const controls = document.getElementById('celestial-controls');
if (controls) createRoot(controls).render(<CelestialPlateControls />);

function preloadNativeLink(event: Event) {
  if (!(event.target instanceof Element)) return;
  const link = event.target.closest<HTMLAnchorElement>('a[href]');
  if (!link || link.closest('#atlas-react-root')) return;
  const url = new URL(link.href);
  if (
    url.origin === location.origin &&
    ['/compare', '/field-notes', '/sources', '/access'].includes(url.pathname)
  )
    void router.preloadRoute({ to: url.pathname });
}
document.addEventListener('pointerover', preloadNativeLink);
document.addEventListener('focusin', preloadNativeLink);
