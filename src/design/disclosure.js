// CSS optimizers serialize 210ms as .21s. Always normalize units for WAAPI.
export function cssTimeMs(value, fallback) {
  const match = String(value)
    .trim()
    .match(/^([+]?(?:\d*\.)?\d+)(ms|s)$/i);
  if (!match) return fallback;
  return Number(match[1]) * (match[2].toLowerCase() === 's' ? 1000 : 1);
}

// The hidden endpoint always points back toward the actual anchor-facing edge.
export function disclosureMotion(side = 'below') {
  const vectors = { above: [0, 1], below: [0, -1], left: [1, 0], right: [-1, 0] };
  const [x, y] = vectors[side] || vectors.below;
  return {
    offset: `${x * 7}px ${y * 7}px`,
    content: `${x * 10}px ${y * 10}px`,
    clip:
      {
        above: 'inset(68% 0% 0% 0%)',
        below: 'inset(0% 0% 68% 0%)',
        left: 'inset(0% 0% 0% 68%)',
        right: 'inset(0% 68% 0% 0%)',
      }[side] || 'inset(0% 0% 68% 0%)',
  };
}

export function createDisclosure({ root, reduce, readStyle = getComputedStyle }) {
  // Each overlay keeps a generation token so interrupted exits cannot hide a reopen.
  const overlays = new Map();
  function disclose(element, open) {
    const previous = overlays.get(element);
    const content = element.querySelector?.('[data-disclosure-content]');
    const side = element.dataset.side || 'below';
    const motion = disclosureMotion(side);
    if (previous?.open === open && previous.side === side) return;
    if (!previous && !open && element.hidden) return;
    const computed = readStyle(element);
    const opacity = element.hidden ? '0' : computed.opacity;
    const offset = element.hidden ? motion.offset : computed.translate;
    const contentStyle = content ? readStyle(content) : null;
    const contentFrom = content && {
      opacity: element.hidden ? 0 : contentStyle.opacity,
      translate: element.hidden
        ? motion.content
        : contentStyle.translate === 'none'
          ? '0 0'
          : contentStyle.translate,
    };
    const clipFrom = element.hidden
      ? motion.clip
      : computed.clipPath === 'none'
        ? 'inset(0% 0% 0% 0%)'
        : computed.clipPath;
    previous?.animations.forEach((animation) => animation.cancel());
    const state = { open, side, animations: [] };
    overlays.set(element, state);
    element.hidden = false;
    element.inert = !open;
    element.setAttribute('aria-hidden', String(!open));
    element.dataset.state = open ? 'open' : 'closing';
    const finish = () => {
      if (overlays.get(element) !== state) return;
      element.hidden = !open;
      element.dataset.state = open ? 'open' : 'closed';
    };
    if (reduce.matches) {
      finish();
      return;
    }
    const tokens = readStyle(root);
    const duration = cssTimeMs(
      tokens.getPropertyValue(open ? '--motion-disclose' : '--motion-enter'),
      open ? 260 : 210,
    );
    state.animations = [
      element.animate([{ opacity }, { opacity: open ? 1 : 0 }], {
        duration,
        easing: tokens.getPropertyValue(open ? '--ease-enter' : '--ease-exit').trim() || 'ease-out',
        fill: 'both',
      }),
      element.animate(
        [
          { translate: offset === 'none' ? '0 0' : offset },
          { translate: open ? '0 0' : motion.offset },
        ],
        {
          duration: open ? cssTimeMs(tokens.getPropertyValue('--motion-disclose'), 260) : duration,
          easing:
            tokens.getPropertyValue(open ? '--ease-spring' : '--ease-exit').trim() || 'ease-out',
          fill: 'both',
        },
      ),
    ];
    // Keep the panel and its actual list alive for the entire reveal/fold. The list
    // moves in the panel's coordinate space; this isn't just a trigger rotation.
    if (content) {
      const contentDuration = cssTimeMs(
        tokens.getPropertyValue(open ? '--motion-disclose' : '--motion-enter'),
        open ? 260 : 210,
      );
      const ease =
        tokens.getPropertyValue(open ? '--ease-enter' : '--ease-exit').trim() || 'ease-out';
      state.animations.push(
        element.animate(
          [{ clipPath: clipFrom }, { clipPath: open ? 'inset(0% 0% 0% 0%)' : motion.clip }],
          { duration: contentDuration, easing: ease, fill: 'both' },
        ),
      );
      state.animations.push(
        content.animate(
          [contentFrom, { opacity: open ? 1 : 0, translate: open ? '0 0' : motion.content }],
          { duration: contentDuration, easing: ease, fill: 'both' },
        ),
      );
    }
    Promise.all(state.animations.map((animation) => animation.finished))
      .then(() => {
        finish();
        if (overlays.get(element) === state)
          state.animations.forEach((animation) => animation.cancel());
      })
      .catch(() => {
        /* A newer disclosure owns the surface now. */
      });
  }
  reduce.addEventListener('change', () => {
    if (!reduce.matches) return;
    overlays.forEach((state, element) => {
      state.animations.forEach((animation) => animation.cancel());
      element.hidden = !state.open;
      element.dataset.state = state.open ? 'open' : 'closed';
    });
  });

  return disclose;
}
