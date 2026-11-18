/** Geometry only: Base UI owns state, semantics, focus and transition lifetime. */
export function celestialPlacement({
  body,
  anchor,
  bounds,
  width,
  height,
  viewportWidth,
  viewportHeight,
}) {
  const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
  let above;
  let x;
  let y;
  if (body === 'sol') {
    const overlap = viewportWidth <= 720 ? 0.7 : 0.84;
    const below = bounds.top + bounds.height * overlap;
    const top = bounds.top + bounds.height * (1 - overlap) - height;
    above =
      below + height > viewportHeight - 8 &&
      (top >= 8 || bounds.top + bounds.height / 2 > viewportHeight / 2);
    y = clamp(above ? top : below, 8, viewportHeight - height - 8);
    x = clamp(bounds.left + bounds.width / 2 - width / 2, 8, viewportWidth - width - 8);
  } else {
    const below = viewportHeight - anchor.bottom;
    above =
      below < height + 8 && anchor.top > below
        ? true
        : anchor.top < height + 8
          ? false
          : anchor.top - bounds.top > bounds.height * 0.55;
    x = clamp(
      anchor.left + anchor.width / 2 - width / 2,
      Math.max(8, bounds.left + 3),
      Math.min(viewportWidth - width - 8, bounds.right - width - 3),
    );
    y = clamp(above ? anchor.top - height - 8 : anchor.bottom + 8, 8, viewportHeight - height - 8);
  }
  return {
    x: x - bounds.left,
    y: y - bounds.top,
    side: above ? 'top' : 'bottom',
    origin: `${clamp(anchor.left + anchor.width / 2 - x, 0, width)}px ${above ? height : 0}px`,
  };
}
/** Pure visual depth; the positioned shell is never transformed by this function. */
export function celestialDepth(pointer, solar, bounds, enabled) {
  if (!enabled || !pointer || !bounds.width || !bounds.height)
    return { x: 0, y: 0, z: 0, depth: 0, origin: '50% 50%' };
  const clamp = (value) => Math.max(-1, Math.min(1, value));
  const centerX = bounds.left + bounds.width / 2;
  const centerY = bounds.top + bounds.height / 2;
  const span = Math.max(bounds.width, bounds.height, 160);
  const solarX = clamp((centerX - solar.x) / span);
  const solarY = clamp((centerY - solar.y) / span);
  const pointerX = clamp((pointer.x - centerX) / Math.max(bounds.width, 160));
  const pointerY = clamp((pointer.y - centerY) / Math.max(bounds.height, 100));
  // At exact solar alignment its direction is zero: only the quarter-strength pointer remains.
  const x = 0.75 * solarX + 0.25 * pointerX;
  const y = 0.75 * solarY + 0.25 * pointerY;
  return {
    x: -y * 3,
    y: x * 3,
    z: x * y * 0.35,
    depth: 4,
    origin: `${50 + x * 25}% ${50 + y * 25}%`,
  };
}
