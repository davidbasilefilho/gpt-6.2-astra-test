/** Bounded presentation only; never changes the interaction shell geometry. */
export function perspectiveAngles(pointer, bounds, enabled) {
  if (!enabled || !pointer || !bounds.width || !bounds.height) return { x: 0, y: 0 };
  const clamp = (value) => Math.max(-1, Math.min(1, value));
  return {
    x: -clamp((pointer.y - bounds.top - bounds.height / 2) / Math.max(bounds.height, 100)) * 2.2,
    y: clamp((pointer.x - bounds.left - bounds.width / 2) / Math.max(bounds.width, 160)) * 2.2,
  };
}
