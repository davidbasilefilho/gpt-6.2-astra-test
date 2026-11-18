import { celestialPhases, solarFilament } from './src/design/celestial-motion.js';
// The React celestial island owns interactions, semantics and popup lifecycles.
// This module only paints the original sky and pointer/scroll parallax.
const doc = document.documentElement;
const plate = document.querySelector('.plate');
const reduce = matchMedia('(prefers-reduced-motion: reduce)');
function syncMotion() {
  doc.dataset.stop = String(reduce.matches);
}
reduce.addEventListener('change', syncMotion);
syncMotion();
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
  const phase = celestialPhases(t);
  plate.style.setProperty('--solar-angle', `${phase.solar.toFixed(3)}deg`);
  plate.style.setProperty('--solar-breath', String(1 + Math.sin(t * 0.65) * 0.012));
  plate.style.setProperty('--corona-opacity', String(0.58 + Math.sin(t * 0.9) * 0.2));
  plate.style.setProperty('--corona-scale', String(1 + Math.sin(t * 0.65) * 0.065));
  plate.style.setProperty('--stellar-target-x', `${((phase.driftX / 720) * 100).toFixed(4)}%`);
  plate.style.setProperty('--stellar-target-y', `${((phase.driftY / 520) * 100).toFixed(4)}%`);
  plate.style.setProperty('--stellar-x', `${phase.driftX.toFixed(3)}px`);
  plate.style.setProperty('--stellar-y', `${phase.driftY.toFixed(3)}px`);
  plate.style.setProperty('--stellar-angle', `${phase.stellarAngle.toFixed(3)}deg`);
  plate.style.setProperty('--starlight', String(0.78 + Math.sin(t * 1.1) * 0.22));
  plate.style.setProperty('--starlight-alt', String(0.77 + Math.cos(t * 0.8 + 1.4) * 0.23));
  orbit(nearBody, phase.luna, 363, 266, 303, 111, -25);
  orbit(farBody, phase.terra, 370, 272, 303, 142, 16);
  rays.forEach((ray, i) => {
    const light = solarFilament(t, i);
    ray.setAttribute(
      'transform',
      `translate(395 395) rotate(${light.angle}) scale(1 ${light.stretch})`,
    );
    ray.setAttribute('opacity', String(light.opacity));
  });
  plate.style.setProperty(
    '--constellation-line-light',
    String(0.55 + (1 + Math.sin(t * 0.48)) * 0.15),
  );
  plate.style.setProperty(
    '--constellation-line-alt',
    String(0.55 + (1 + Math.sin(t * 0.41 + 1.4)) * 0.15),
  );
  stars.forEach((star, i) => {
    if (i % 4 === 0) star.setAttribute('opacity', String(0.48 + Math.sin(t * 0.7 + i) * 0.27));
  });
}
// Fine light filaments move independently of the engraved solar disc.
const rayGroup = document.getElementById('solar-ray-lights');
const rays = Array.from({ length: 12 }, () => {
  const ray = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  ray.setAttribute('d', 'M0-286Q13-319 2-350Q-5-361 3-378');
  rayGroup.append(ray);
  return ray;
});
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
  document.dispatchEvent(new Event('atlas:sky-frame'));
  requestAnimationFrame(animateSky);
}
requestAnimationFrame(animateSky);
