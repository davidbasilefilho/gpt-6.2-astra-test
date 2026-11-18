/** In seconds for Motion. CSS controls use the matching design-system.css tokens. */
export const timing = { fast: 0.14, enter: 0.21, disclose: 0.26 } as const;
export const easeEnter = [0.2, 0.75, 0.25, 1] as const;
export const easeExit = [0.4, 0, 0.8, 0.25] as const;
// A control affordance can settle like a physical object; text and height should not bounce.
export const controlSpring = { type: 'spring', stiffness: 490, damping: 33, mass: 0.72 } as const;
