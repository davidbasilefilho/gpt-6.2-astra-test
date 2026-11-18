import type { SVGProps } from 'react';

/** Deliberately finite vocabulary shared with scripts/generate-icons.mjs. */
export type UiIconName =
  | 'arrow-right'
  | 'arrow-up-right'
  | 'check'
  | 'chevron-down'
  | 'monitor'
  | 'moon'
  | 'plus'
  | 'sun';

type UiIconProps = Omit<SVGProps<SVGSVGElement>, 'children' | 'name'> & { name: UiIconName };
/** Decorative by default; give the containing action its accessible name. */
export function UiIcon({ name, className = '', ...props }: UiIconProps) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={`ds-icon ${className}`}
      {...props}
    >
      <use href={`/assets/ui-icons.svg#${name}`} />
    </svg>
  );
}
