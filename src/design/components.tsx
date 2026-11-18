import { motion, useReducedMotion } from 'motion/react';
import type { ButtonHTMLAttributes } from 'react';

import { controlSpring } from './motion';

type ActionProps = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'primary' | 'outline' };
export function ActionButton({
  variant = 'outline',
  className = '',
  type = 'button',
  ...props
}: ActionProps) {
  return (
    <button type={type} className={`ds-action ds-action--${variant} ${className}`} {...props} />
  );
}
export function DisclosureMark({ open }: { open: boolean }) {
  const reduced = useReducedMotion();
  return (
    <motion.svg
      className="ds-disclosure-mark"
      aria-hidden="true"
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      animate={{ rotate: open ? 45 : 0 }}
      transition={reduced ? { duration: 0 } : controlSpring}
    >
      <use href="/assets/ui-icons.svg#plus" />
    </motion.svg>
  );
}
