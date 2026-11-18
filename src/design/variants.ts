import { cn } from 'cn';

export { cn };

export type ControlVariants = {
  variant?: 'default' | 'primary' | 'outline' | 'ghost';
  tone?: 'accent' | 'neutral';
  size?: 'sm' | 'md' | 'lg' | 'icon';
};
export function controlVariants({
  variant = 'default',
  tone = 'accent',
  size = 'md',
}: ControlVariants = {}) {
  return cn(
    'ds-action',
    `ds-action--${variant === 'primary' ? 'default' : variant}`,
    `ds-tone--${tone}`,
    `ds-size--${size}`,
  );
}
