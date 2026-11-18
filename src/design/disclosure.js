export function createDisclosure({ root, reduce, readStyle = getComputedStyle }) {
  // Each overlay keeps a generation token so interrupted exits cannot hide a reopen.
  const overlays = new Map();
  function disclose(element, open) {
    const previous = overlays.get(element);
    const content = element.querySelector?.('[data-disclosure-content]');
    if (previous?.open === open) return;
    if (!previous && !open && element.hidden) return;
    const computed = readStyle(element);
    const opacity = element.hidden ? '0' : computed.opacity;
    const offset = element.hidden ? '0 -7px' : computed.translate;
    const contentStyle = content ? readStyle(content) : null;
    const contentFrom = content && {
      opacity: element.hidden ? 0 : contentStyle.opacity,
      translate: element.hidden
        ? '0 -10px'
        : contentStyle.translate === 'none'
          ? '0 0'
          : contentStyle.translate,
    };
    const clipFrom = element.hidden
      ? 'inset(0% 0% 68% 0%)'
      : computed.clipPath === 'none'
        ? 'inset(0% 0% 0% 0%)'
        : computed.clipPath;
    previous?.animations.forEach((animation) => animation.cancel());
    const state = { open, animations: [] };
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
    const duration =
      parseFloat(tokens.getPropertyValue(open ? '--motion-enter' : '--motion-fast')) ||
      (open ? 210 : 140);
    state.animations = [
      element.animate([{ opacity }, { opacity: open ? 1 : 0 }], {
        duration,
        easing: tokens.getPropertyValue(open ? '--ease-enter' : '--ease-exit').trim() || 'ease-out',
        fill: 'both',
      }),
      element.animate(
        [{ translate: offset === 'none' ? '0 0' : offset }, { translate: open ? '0 0' : '0 -5px' }],
        {
          duration: open
            ? parseFloat(tokens.getPropertyValue('--motion-disclose')) || 260
            : duration,
          easing:
            tokens.getPropertyValue(open ? '--ease-spring' : '--ease-exit').trim() || 'ease-out',
          fill: 'both',
        },
      ),
    ];
    // Keep the panel and its actual list alive for the entire reveal/fold. The list
    // moves in the panel's coordinate space; this isn't just a trigger rotation.
    if (content) {
      const contentDuration =
        parseFloat(tokens.getPropertyValue(open ? '--motion-disclose' : '--motion-enter')) ||
        (open ? 260 : 210);
      const ease =
        tokens.getPropertyValue(open ? '--ease-enter' : '--ease-exit').trim() || 'ease-out';
      state.animations.push(
        element.animate(
          [
            { clipPath: clipFrom },
            { clipPath: open ? 'inset(0% 0% 0% 0%)' : 'inset(0% 0% 68% 0%)' },
          ],
          { duration: contentDuration, easing: ease, fill: 'both' },
        ),
      );
      state.animations.push(
        content.animate(
          [contentFrom, { opacity: open ? 1 : 0, translate: open ? '0 0' : '0 -10px' }],
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
