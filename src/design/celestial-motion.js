/** Continuous phases with bounded acceleration: no loop reset or direction snap. */
export function celestialPhases(seconds) {
  return {
    solar: 9 * seconds + 7 * Math.sin(seconds * 0.45),
    luna: 2.76 + (seconds * Math.PI * 2) / 24 + 0.28 * Math.sin(seconds * 0.5),
    terra: -0.72 - (seconds * Math.PI * 2) / 36 - 0.25 * Math.sin(seconds * 0.37),
    driftX: 6 * Math.sin(seconds * 0.55),
    driftY: 5 * Math.sin(seconds * 0.71),
    stellarAngle: 1.2 * Math.sin(seconds * 0.32),
  };
}

export function solarFilament(seconds, index) {
  const phase = seconds * (0.34 + index * 0.017) + index * 1.7;
  return {
    angle: index * 30 + Math.sin(phase * 0.8) * 2,
    stretch: 1 + Math.sin(phase) * 0.025,
    opacity: 0.2 + (1 + Math.sin(phase)) * 0.1,
  };
}
