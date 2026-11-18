import { Button } from '@base-ui/react/button';
import { motion, useReducedMotion } from 'motion/react';
import type { AnchorHTMLAttributes } from 'react';

import { controlSpring } from './motion';
import { cn, controlVariants, type ControlVariants } from './variants';

type ActionProps = Omit<Button.Props, 'className'> & ControlVariants & { className?: string };
export function ActionButton({
  variant = 'outline',
  className,
  tone,
  size,
  type = 'button',
  ...props
}: ActionProps) {
  return (
    <Button
      type={type}
      className={cn(controlVariants({ variant, tone, size }), className)}
      {...props}
    />
  );
}
/** Navigation stays a real anchor, including open-in-new-tab and copy-link behavior. */
export function ButtonLink({
  variant,
  tone,
  size,
  className,
  children,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & ControlVariants) {
  return (
    <a className={cn(controlVariants({ variant, tone, size }), className)} {...props}>
      {children}
    </a>
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
