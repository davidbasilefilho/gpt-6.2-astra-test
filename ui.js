import { createDisclosure } from './src/design/disclosure.js';
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
  themeButton.setAttribute('aria-label', 'Appearance: ' + t);
  options.forEach((b) => {
    const checked = b.dataset.themeChoice === t;
    b.setAttribute('aria-checked', String(checked));
    b.tabIndex = checked ? 0 : -1;
  });
  document
    .querySelector('meta[name="theme-color"]')
    .setAttribute('content', doc.dataset.palette === 'dark' ? '#211e26' : '#fbf7ee');
}
function closeMenu(restore = false) {
  disclose(menu, false);
  themeButton.setAttribute('aria-expanded', 'false');
  if (restore) themeButton.focus();
}
themeButton.addEventListener('click', () => {
  if (themeButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    return;
  }
  disclose(menu, true);
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
  disclose(menu, true);
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
    doc.dataset.theme = b.dataset.themeChoice;
    save('appearance', b.dataset.themeChoice);
    syncTheme();
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
systemTheme.addEventListener('change', syncTheme);
syncTheme();
function syncMotion() {
  doc.dataset.stop = String(reduce.matches);
}
reduce.addEventListener('change', syncMotion);
syncMotion();
const bodies = [...document.querySelectorAll('.celestial-focus')];
let closeTimer = 0;
function showBody(body) {
  clearTimeout(closeTimer);
  plate.dataset.observe = body?.dataset.body || 'overview';
  bodies.forEach((item) => {
    const expanded = item === body;
    item.querySelector('button').setAttribute('aria-expanded', String(expanded));
    disclose(item.querySelector('.body-popover'), expanded);
  });
}
bodies.forEach((body) => {
  const button = body.querySelector('button');
  const companion = body.querySelector('.astra-companion-hit');
  button.addEventListener('pointerenter', () => {
    body.dataset.anchor = 'main';
  });
  button.addEventListener('focus', () => {
    if (!body.matches(':hover')) body.dataset.anchor = 'main';
  });
  if (companion) {
    companion.addEventListener('pointerenter', () => {
      body.dataset.anchor = 'companion';
    });
    companion.addEventListener('pointerdown', (event) => {
      const wasOnThis =
        button.getAttribute('aria-expanded') === 'true' && body.dataset.tapAnchor === 'companion';
      body.dataset.anchor = 'companion';
      body.dataset.tapAnchor = 'companion';
      if (event.pointerType === 'touch' && wasOnThis) {
        showBody(null);
        button.blur();
      } else {
        button.focus({ preventScroll: true });
        showBody(body);
      }
    });
    button.addEventListener('pointerdown', () => {
      body.dataset.tapAnchor = 'main';
    });
  }
  body.addEventListener('pointerenter', (event) => {
    if (event.pointerType !== 'touch') showBody(body);
  });
  body.addEventListener('pointerleave', (event) => {
    if (event.pointerType === 'touch') return;
    closeTimer = setTimeout(() => {
      if (!body.matches(':focus-within')) showBody(null);
    }, 180);
  });
  body.addEventListener('focusin', () => showBody(body));
  body.addEventListener('focusout', (event) => {
    if (!body.contains(event.relatedTarget)) showBody(null);
  });
  button.addEventListener('click', (event) => {
    // A touch click follows focusin; remember whether this tap began open.
    if (event.pointerType === 'touch' && body.dataset.wasOpen === 'true') {
      showBody(null);
      button.blur();
    } else showBody(body);
  });
  button.addEventListener('pointerdown', () => {
    body.dataset.wasOpen = button.getAttribute('aria-expanded');
  });
});
document.addEventListener('pointerdown', (event) => {
  if (!event.target.closest('.celestial-focus')) showBody(null);
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && plate.dataset.observe !== 'overview') {
    const active = bodies.find((body) => body.dataset.body === plate.dataset.observe);
    active?.querySelector('button').focus();
    showBody(null);
  }
});
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
  requestAnimationFrame(animateSky);
}
requestAnimationFrame(animateSky);
