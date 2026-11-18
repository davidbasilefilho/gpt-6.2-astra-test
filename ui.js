const doc = document.documentElement;
const plate = document.querySelector('.plate');
const themeButton = document.querySelector('#theme-trigger');
const menu = document.querySelector('#theme-menu');
const options = [...document.querySelectorAll('[data-theme-choice]')];
const systemTheme = matchMedia('(prefers-color-scheme: dark)');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
function get(key) {
  try {
    return localStorage.getItem('atlas.' + key);
  } catch {
    return null;
  }
}
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
  options.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.themeChoice === t)));
  document
    .querySelector('meta[name="theme-color"]')
    .setAttribute('content', doc.dataset.palette === 'dark' ? '#211e26' : '#fbf7ee');
}
function closeMenu(restore = false) {
  menu.hidden = true;
  themeButton.setAttribute('aria-expanded', 'false');
  if (restore) themeButton.focus();
}
themeButton.addEventListener('click', () => {
  if (!menu.hidden) {
    closeMenu();
    return;
  }
  menu.hidden = false;
  themeButton.setAttribute('aria-expanded', 'true');
  options.find((b) => b.dataset.themeChoice === doc.dataset.theme)?.focus();
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
  if (!menu.hidden && !e.target.closest('.theme-control')) closeMenu();
});
document.addEventListener('keydown', (e) => {
  if (!menu.hidden && e.key === 'Escape') {
    e.preventDefault();
    closeMenu(true);
  }
});
document.addEventListener('focusin', (e) => {
  if (!menu.hidden && !e.target.closest('.theme-control')) closeMenu();
});
systemTheme.addEventListener('change', syncTheme);
syncTheme();
const motionButton = document.querySelector('#motion-toggle');
let paused = get('chart-paused') === 'true';
function motion() {
  doc.dataset.stop = String(paused || reduce.matches);
  motionButton.textContent = '';
  motionButton.setAttribute('aria-pressed', doc.dataset.stop);
  const t = reduce.matches
    ? 'Chart motion disabled by system preference'
    : paused
      ? 'Play chart motion'
      : 'Pause chart motion';
  motionButton.setAttribute('aria-label', t);
  motionButton.title = t;
  motionButton.disabled = reduce.matches;
}
motionButton.addEventListener('click', () => {
  paused = !paused;
  save('chart-paused', String(paused));
  motion();
});
reduce.addEventListener('change', motion);
motion();
const captions = {
  overview: 'The Sol–Astra system. Select a body to study its orbit.',
  sol: 'Sol. OpenAI positions it for everyday professional work.',
  astra: 'Astra. OpenAI positions it for harder, longer projects.',
};
document.querySelectorAll('[data-pick]').forEach((b) =>
  b.addEventListener('click', () => {
    const pick = b.dataset.pick;
    plate.dataset.observe = pick;
    document.querySelector('#plate-caption').textContent = captions[pick];
    document
      .querySelectorAll('[data-pick]')
      .forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.pick === pick)));
  }),
);
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
