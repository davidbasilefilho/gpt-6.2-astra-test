import { createDisclosure } from './src/design/disclosure.js';
import { perspectiveAngles } from './src/design/perspective.js';
const doc = document.documentElement;
const plate = document.querySelector('.plate');
const themeButton = document.querySelector('#theme-trigger');
const menu = document.querySelector('#theme-menu');
const options = [...document.querySelectorAll('[data-theme-choice]')];
const systemTheme = matchMedia('(prefers-color-scheme: dark)');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
const disclose = createDisclosure({ root: doc, reduce });
function save(key, value) {
  try {
    localStorage.setItem('atlas.' + key, value);
  } catch {
    /* Preference still applies in memory. */
  }
}
function syncTheme() {
  const t = doc.dataset.theme;
  doc.dataset.palette = t === 'system' ? (systemTheme.matches ? 'dark' : 'light') : t;
  themeButton.setAttribute('aria-label', 'Theme: ' + t);
  const icon = themeButton.querySelector('.theme-phase');
  const selectedIcon = options
    .find((option) => option.dataset.themeChoice === t)
    ?.querySelector('svg');
  if (selectedIcon)
    icon.replaceChildren(...[...selectedIcon.childNodes].map((node) => node.cloneNode(true)));
  options.forEach((b) => {
    const checked = b.dataset.themeChoice === t;
    b.setAttribute('aria-checked', String(checked));
    b.tabIndex = checked ? 0 : -1;
  });
  document
    .querySelector('meta[name="theme-color"]')
    .setAttribute('content', doc.dataset.palette === 'dark' ? '#211e26' : '#ded5c5');
}
let themeTransition = null;
let themeGeneration = 0;
let themeFallbackTimer = 0;
function stopThemeTransition() {
  themeTransition?.skipTransition();
  themeTransition = null;
  delete doc.dataset.themeTransition;
}
function changeAppearance(theme, persist = true) {
  const generation = ++themeGeneration;
  stopThemeTransition();
  clearTimeout(themeFallbackTimer);
  delete doc.dataset.themeFading;
  const apply = () => {
    if (generation !== themeGeneration) return;
    doc.dataset.theme = theme;
    if (persist) save('appearance', theme);
    syncTheme();
  };
  if (reduce.matches) {
    apply();
    return;
  }
  const routeTransition =
    document.activeViewTransition ||
    (CSS.supports('selector(:active-view-transition)') && doc.matches(':active-view-transition'));
  if (typeof document.startViewTransition === 'function' && !routeTransition) {
    doc.dataset.themeTransition = 'true';
    const transition = document.startViewTransition(apply);
    themeTransition = transition;
    transition.ready.catch(() => {
      /* Superseded by rapid input or navigation. */
    });
    transition.finished
      .finally(() => {
        if (themeTransition === transition) {
          themeTransition = null;
          delete doc.dataset.themeTransition;
        }
      })
      .catch(() => {});
  } else {
    // CSS colors interpolate when snapshots are unavailable or a route owns them.
    doc.dataset.themeFading = 'true';
    void getComputedStyle(doc).color;
    apply();
    themeFallbackTimer = setTimeout(() => {
      delete doc.dataset.themeFading;
    }, 300);
  }
}
document.addEventListener(
  'click',
  (event) => {
    if (themeTransition && event.target.closest('a[href]')) stopThemeTransition();
  },
  { capture: true },
);
window.addEventListener('popstate', stopThemeTransition);
reduce.addEventListener('change', () => {
  if (reduce.matches) {
    stopThemeTransition();
    clearTimeout(themeFallbackTimer);
    delete doc.dataset.themeFading;
  }
});
function setOverlayOrigin(panel, anchor, side) {
  const box = panel.getBoundingClientRect();
  const target = anchor.getBoundingClientRect();
  const x = Math.max(0, Math.min(box.width, target.left + target.width / 2 - box.left));
  const y = side === 'above' ? box.height : 0;
  panel.style.setProperty('--overlay-origin', `${x}px ${y}px`);
  panel.dataset.side = side;
}
function measureOverlay(panel, position) {
  const hidden = panel.hidden;
  if (hidden) {
    panel.style.visibility = 'hidden';
    panel.hidden = false;
  }
  position();
  if (hidden) {
    panel.hidden = true;
    panel.style.visibility = '';
  }
}
function placeThemeMenu() {
  measureOverlay(menu, () => {
    const anchor = themeButton.getBoundingClientRect();
    const width = menu.offsetWidth;
    const height = menu.offsetHeight;
    const above = anchor.bottom + height + 8 > innerHeight && anchor.top > height + 8;
    menu.style.left = `${Math.max(8, Math.min(innerWidth - width - 8, anchor.right - width))}px`;
    menu.style.top = `${above ? anchor.top - height - 5 : anchor.bottom + 5}px`;
    setOverlayOrigin(menu, themeButton, above ? 'above' : 'below');
  });
  if (!menu.hidden) disclose(menu, menu.dataset.state !== 'closing');
}
function openMenu() {
  placeThemeMenu();
  disclose(menu, true);
}
window.addEventListener('resize', placeThemeMenu, { passive: true });
window.addEventListener(
  'scroll',
  () => {
    if (!menu.hidden) placeThemeMenu();
  },
  { passive: true },
);
function closeMenu(restore = false) {
  disclose(menu, false);
  themeButton.setAttribute('aria-expanded', 'false');
  if (restore) themeButton.focus({ preventScroll: true });
}
themeButton.addEventListener('click', () => {
  if (themeButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    return;
  }
  openMenu();
  themeButton.setAttribute('aria-expanded', 'true');
  options.find((b) => b.dataset.themeChoice === doc.dataset.theme)?.focus();
});
function focusOption(index) {
  const next = (index + options.length) % options.length;
  options.forEach((option, i) => {
    option.tabIndex = i === next ? 0 : -1;
  });
  options[next].focus();
}
themeButton.addEventListener('keydown', (event) => {
  if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return;
  event.preventDefault();
  openMenu();
  themeButton.setAttribute('aria-expanded', 'true');
  focusOption(event.key === 'ArrowDown' ? 0 : options.length - 1);
});
menu.addEventListener('keydown', (event) => {
  const index = options.indexOf(document.activeElement);
  if (['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
    event.preventDefault();
    focusOption(
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? options.length - 1
          : index + (event.key === 'ArrowDown' ? 1 : -1),
    );
  }
  if (event.key === 'Tab') setTimeout(() => closeMenu(), 0);
});
options.forEach((b) =>
  b.addEventListener('click', () => {
    changeAppearance(b.dataset.themeChoice);
    closeMenu(true);
  }),
);
document.addEventListener('click', (e) => {
  if (themeButton.getAttribute('aria-expanded') === 'true' && !e.target.closest('.theme-control'))
    closeMenu();
});
document.addEventListener('keydown', (e) => {
  if (themeButton.getAttribute('aria-expanded') === 'true' && e.key === 'Escape') {
    e.preventDefault();
    closeMenu(true);
  }
});
document.addEventListener('focusin', (e) => {
  if (themeButton.getAttribute('aria-expanded') === 'true' && !e.target.closest('.theme-control'))
    closeMenu();
});
systemTheme.addEventListener('change', () => {
  if (doc.dataset.theme === 'system') changeAppearance('system', false);
});
syncTheme();
function syncMotion() {
  doc.dataset.stop = String(reduce.matches);
}
reduce.addEventListener('change', syncMotion);
syncMotion();
const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
let perspectivePointer = null;
function neutralizePerspective() {
  perspectivePointer = null;
  document.querySelectorAll('.body-popover').forEach((popover) => {
    popover.style.setProperty('--tilt-x', '0deg');
    popover.style.setProperty('--tilt-y', '0deg');
  });
}
function updatePerspective() {
  const enabled = finePointer.matches && !reduce.matches && perspectivePointer;
  document.querySelectorAll('.body-popover:not([hidden])').forEach((popover) => {
    const angles = perspectiveAngles(perspectivePointer, popover.getBoundingClientRect(), enabled);
    popover.style.setProperty('--tilt-x', `${angles.x.toFixed(3)}deg`);
    popover.style.setProperty('--tilt-y', `${angles.y.toFixed(3)}deg`);
  });
}
document.addEventListener('keydown', neutralizePerspective, { capture: true });
document.addEventListener(
  'pointerdown',
  (event) => {
    if (event.pointerType !== 'mouse') neutralizePerspective();
  },
  { capture: true },
);
reduce.addEventListener('change', neutralizePerspective);
finePointer.addEventListener('change', neutralizePerspective);
plate.addEventListener('pointermove', (event) => {
  if (event.pointerType === 'mouse' && finePointer.matches && !reduce.matches) {
    perspectivePointer = { x: event.clientX, y: event.clientY };
  } else neutralizePerspective();
});
plate.addEventListener('pointerleave', neutralizePerspective);
const bodies = [...document.querySelectorAll('.celestial-focus')];
const starTargets = [...document.querySelectorAll('[data-star]')];
const starArtwork = [...document.querySelectorAll('.constellation use')];
const astraBody = document.querySelector('.astra-focus');
const orbitTargets = [...document.querySelectorAll('[data-orbit]')];
// One tab stop for the constellation; every star remains a pointer/touch target.
starTargets.forEach((target, index) => {
  target.addEventListener('focus', () => {
    starTargets.forEach((star) => {
      star.tabIndex = star === target ? 0 : -1;
    });
  });
  target.addEventListener('keydown', (event) => {
    let next;
    if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = starTargets.length - 1;
    else if (event.key === 'ArrowRight' || event.key === 'ArrowDown')
      next = (index + 1) % starTargets.length;
    else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
      next = (index - 1 + starTargets.length) % starTargets.length;
    else if (event.key === 'Tab' && !event.shiftKey) {
      event.preventDefault();
      orbitTargets[0]?.focus({ preventScroll: true });
      return;
    } else return;
    event.preventDefault();
    starTargets[next].focus({ preventScroll: true });
  });
});
const bodyAnchors = new Map();
let activeTarget = null;
let closeTimer = 0;
let lastTouch = 0;
let lastMouseMove = 0;
function placeSolPopover(popover, target) {
  const bounds = target.closest('.sol-focus').getBoundingClientRect();
  const margin = 8;
  popover.style.maxHeight = `${Math.max(1, innerHeight - margin * 2)}px`;
  popover.style.overflowY = popover.scrollHeight > innerHeight - margin * 2 ? 'auto' : '';
  const width = popover.offsetWidth;
  const height = popover.offsetHeight;
  // Preserve the cover's intentional overlap rather than pushing beyond the sun.
  const overlap = innerWidth <= 720 ? 0.7 : 0.84;
  const belowY = bounds.top + bounds.height * overlap;
  const aboveY = bounds.top + bounds.height * (1 - overlap) - height;
  const above =
    belowY + height > innerHeight - margin &&
    (aboveY >= margin || bounds.top + bounds.height / 2 > innerHeight / 2);
  const desiredY = above ? aboveY : belowY;
  const y = Math.max(margin, Math.min(innerHeight - height - margin, desiredY));
  const center = bounds.left + bounds.width / 2;
  const x = Math.max(margin, Math.min(innerWidth - width - margin, center - width / 2));
  // Existing translateX(-50%) keeps solar centering; clamp adjusts its center only.
  popover.style.left = `${x + width / 2 - bounds.left}px`;
  popover.style.top = `${y - bounds.top}px`;
  setOverlayOrigin(popover, target, above ? 'above' : 'below');
  if (!popover.hidden && popover.style.visibility !== 'hidden')
    disclose(popover, popover.dataset.state !== 'closing');
}
function placePopover(popover, target, bounds) {
  const rect = target.getBoundingClientRect();
  const width = popover.offsetWidth;
  const height = popover.offsetHeight;
  const center = rect.left + rect.width / 2 - bounds.left;
  const roomBelow = innerHeight - rect.bottom;
  const roomAbove = rect.top;
  const above =
    roomBelow < height + 8 && roomAbove > roomBelow
      ? true
      : roomAbove < height + 8
        ? false
        : rect.top - bounds.top > bounds.height * 0.55;
  const x = Math.max(3, Math.min(bounds.width - width - 3, center - width / 2));
  const y = above ? rect.top - bounds.top - height - 8 : rect.bottom - bounds.top + 8;
  popover.style.left = `${x}px`;
  popover.style.top = `${y}px`;
  setOverlayOrigin(popover, target, above ? 'above' : 'below');
  if (!popover.hidden && popover.style.visibility !== 'hidden')
    disclose(popover, popover.dataset.state !== 'closing');
}
function placeStars() {
  if (document.querySelector('#landing').hidden) return;
  const bounds = astraBody.getBoundingClientRect();
  if (!bounds.width) return;
  const entries = starTargets.map((target, i) => ({
    target,
    rect: starArtwork[i].getBoundingClientRect(),
  }));
  orbitTargets.forEach((target) =>
    entries.push({
      target,
      rect: document.getElementById(target.dataset.orbit).getBoundingClientRect(),
    }),
  );
  entries.forEach(({ target, rect }) => {
    target.style.left = `${rect.left + rect.width / 2 - bounds.left}px`;
    target.style.top = `${rect.top + rect.height / 2 - bounds.top}px`;
  });
  bodyAnchors.forEach((target, body) => {
    const popover = body.querySelector('.body-popover');
    if (!popover.hidden) {
      if (body.dataset.body !== 'sol') placePopover(popover, target, bounds);
      else placeSolPopover(popover, target);
    }
  });
}
function showBody(body, target = null) {
  clearTimeout(closeTimer);
  if (target) {
    activeTarget = target;
    bodyAnchors.set(body, target);
  }
  plate.dataset.observe = body?.dataset.body || 'overview';
  bodies.forEach((item) => {
    const expanded = item === body;
    item.querySelectorAll('button').forEach((button) => {
      button.setAttribute('aria-expanded', String(expanded && button === activeTarget));
    });
    const panel = item.querySelector('.body-popover');
    if (expanded)
      measureOverlay(panel, () => {
        if (item.dataset.body === 'sol') placeSolPopover(panel, activeTarget);
        else placePopover(panel, activeTarget, astraBody.getBoundingClientRect());
      });
    disclose(panel, expanded);
  });
  placeStars();
}
bodies.forEach((body) => {
  body.addEventListener('pointerenter', () => clearTimeout(closeTimer));
  body.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'touch') return;
    closeTimer = setTimeout(() => {
      if (
        plate.dataset.observe === body.dataset.body &&
        !bodies.some((item) => item.matches(':focus-within'))
      )
        showBody(null);
    }, 180);
  });
  body.addEventListener('focusout', (event) => {
    if (!body.contains(event.relatedTarget)) showBody(null);
  });
  body.querySelectorAll('button').forEach((button) => {
    button.addEventListener('pointerenter', (event) => {
      if (
        event.pointerType !== 'touch' &&
        Date.now() - lastTouch > 800 &&
        Date.now() - lastMouseMove < 200
      )
        showBody(body, button);
    });
    button.addEventListener('pointermove', (event) => {
      if (
        event.pointerType !== 'touch' &&
        Date.now() - lastTouch > 800 &&
        (activeTarget !== button || plate.dataset.observe !== body.dataset.body)
      )
        showBody(body, button);
    });
    button.addEventListener('focus', () => showBody(body, button));
    button.addEventListener('pointerdown', (event) => {
      if (event.pointerType === 'touch') lastTouch = Date.now();
      button.dataset.wasOpen = button.getAttribute('aria-expanded');
    });
    button.addEventListener('click', (event) => {
      if (event.pointerType === 'touch' && button.dataset.wasOpen === 'true') {
        showBody(null);
        button.blur();
      } else showBody(body, button);
    });
  });
});
document.addEventListener('pointerdown', (event) => {
  if (!event.target.closest('.celestial-focus')) showBody(null);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && plate.dataset.observe !== 'overview') {
    activeTarget?.focus({ preventScroll: true });
    showBody(null);
  }
});
window.addEventListener('resize', placeStars, { passive: true });
let px = 0,
  py = 0,
  sc = 0,
  raf = 0;
function redraw() {
  raf = 0;
  plate.style.setProperty('--px', px + 'px');
  plate.style.setProperty('--py', py + 'px');
  plate.style.setProperty('--scroll', sc + 'px');
}
function draw() {
  if (!raf) raf = requestAnimationFrame(redraw);
}
plate.addEventListener('pointermove', (e) => {
  if (e.pointerType !== 'touch') lastMouseMove = Date.now();
  if (doc.dataset.stop === 'true' || e.pointerType === 'touch') return;
  const r = plate.getBoundingClientRect();
  px = Math.max(-12, Math.min(12, (e.clientX - r.left - r.width / 2) * 0.065));
  py = Math.max(-9, Math.min(9, (e.clientY - r.top - r.height / 2) * 0.07));
  draw();
});
plate.addEventListener('pointerleave', () => {
  if (doc.dataset.stop === 'true') return;
  px = 0;
  py = 0;
  draw();
});
window.addEventListener(
  'scroll',
  () => {
    if (doc.dataset.stop === 'true' || document.querySelector('#landing').hidden) return;
    sc = Math.min(18, scrollY * 0.035);
    draw();
  },
  { passive: true },
);
let seed = 371;
function rand() {
  seed = (seed * 16807) % 2147483647;
  return seed / 2147483647;
}
const dust = document.querySelector('#dust');
for (let i = 0; i < 95; i++) {
  const s = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
  s.setAttribute('cx', String(12 + rand() * 696));
  s.setAttribute('cy', String(14 + rand() * 482));
  s.setAttribute('r', String(0.42 + rand() * 1.15));
  s.setAttribute('opacity', String(0.25 + rand() * 0.55));
  s.setAttribute('fill', 'var(--star)');
  dust.append(s);
}

// One elapsed-time clock keeps every celestial layer in phase. Reduced motion
// freezes positions; background tabs do not accumulate time.
const nearBody = document.querySelector('#orbiter-near');
const farBody = document.querySelector('#orbiter-far');
const stars = [...dust.children];
let elapsed = 0;
let previousFrame = 0;
function orbit(body, angle, cx, cy, rx, ry, tilt) {
  const x = Math.cos(angle) * rx;
  const y = Math.sin(angle) * ry;
  const r = (tilt * Math.PI) / 180;
  body.setAttribute(
    'transform',
    `translate(${(cx + x * Math.cos(r) - y * Math.sin(r)).toFixed(2)} ${(cy + x * Math.sin(r) + y * Math.cos(r)).toFixed(2)})`,
  );
}
function paintSky(t) {
  plate.style.setProperty('--solar-angle', `${(t * 3.6).toFixed(3)}deg`);
  plate.style.setProperty('--solar-breath', String(1 + Math.sin(t * 0.65) * 0.012));
  plate.style.setProperty('--corona-opacity', String(0.58 + Math.sin(t * 0.9) * 0.2));
  plate.style.setProperty('--corona-scale', String(1 + Math.sin(t * 0.65) * 0.065));
  plate.style.setProperty(
    '--stellar-target-x',
    `${(((Math.sin(t * 0.19) * 6) / 720) * 100).toFixed(4)}%`,
  );
  plate.style.setProperty(
    '--stellar-target-y',
    `${(((Math.sin(t * 0.26) * 5) / 520) * 100).toFixed(4)}%`,
  );
  plate.style.setProperty('--stellar-x', `${(Math.sin(t * 0.19) * 6).toFixed(3)}px`);
  plate.style.setProperty('--stellar-y', `${(Math.sin(t * 0.26) * 5).toFixed(3)}px`);
  plate.style.setProperty('--stellar-angle', `${(Math.sin(t * 0.14) * 1.2).toFixed(3)}deg`);
  plate.style.setProperty('--starlight', String(0.78 + Math.sin(t * 1.1) * 0.22));
  plate.style.setProperty('--starlight-alt', String(0.77 + Math.cos(t * 0.8 + 1.4) * 0.23));
  orbit(nearBody, 2.76 + (t * Math.PI * 2) / 44, 363, 266, 303, 111, -25);
  orbit(farBody, -0.72 - (t * Math.PI * 2) / 67, 370, 272, 303, 142, 16);
  stars.forEach((star, i) => {
    if (i % 4 === 0) star.setAttribute('opacity', String(0.48 + Math.sin(t * 0.7 + i) * 0.27));
  });
}
paintSky(0);
function animateSky(now) {
  const dt = previousFrame ? Math.min((now - previousFrame) / 1000, 0.05) : 0;
  previousFrame = now;
  if (
    doc.dataset.stop !== 'true' &&
    !document.hidden &&
    !document.querySelector('#landing').hidden
  ) {
    elapsed += dt;
    paintSky(elapsed);
  }
  placeStars();
  updatePerspective();
  requestAnimationFrame(animateSky);
}
requestAnimationFrame(animateSky);
