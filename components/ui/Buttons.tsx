'use client';

import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'ghost' | 'ghost-dark';

const cls = (variant: Variant, extra?: string) => ['btn', `btn-${variant}`, extra].filter(Boolean).join(' ');

interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  children: ReactNode;
}

/** The one dominant action. Matte gold, navy type. No icon: the button carries itself. */
export function PrimaryButton({ children, className, ...rest }: LinkProps) {
  return (
    <a className={cls('primary', className)} {...rest}>
      {children}
    </a>
  );
}

export function SecondaryButton({ children, className, dark = false, ...rest }: LinkProps & { dark?: boolean }) {
  return (
    <a className={cls(dark ? 'ghost-dark' : 'ghost', className)} {...rest}>
      {children}
    </a>
  );
}

interface ActionProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  loading?: boolean;
  loadingLabel?: string;
}

/** Button for in-page actions (wizard). Shows a spinner while loading. */
export function ActionButton({ variant = 'primary', loading = false, loadingLabel = 'Enviando…', className, children, disabled, ...rest }: ActionProps) {
  return (
    <button type="button" className={cls(variant, className)} disabled={disabled || loading} aria-busy={loading || undefined} {...rest}>
      {loading ? (
        <>
          <span className="spin" aria-hidden="true" />
          {loadingLabel}
        </>
      ) : (
        children
      )}
    </button>
  );
}
