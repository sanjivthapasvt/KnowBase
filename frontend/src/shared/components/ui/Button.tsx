'use client';
import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/shared/utils/cn';
import { Spinner } from './Spinner';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantStyles: Record<Variant, string> = {
  primary: 'bg-[rgb(var(--color-brand-default))] text-white hover:bg-[rgb(var(--color-brand-hover))] active:bg-[rgb(var(--color-brand-muted))] active:scale-[0.98]',
  secondary: 'bg-[rgb(var(--color-bg-surface-3))] text-[rgb(var(--color-text-secondary))] border border-[rgb(var(--color-border-default))] hover:bg-[rgb(var(--color-bg-surface-4))] active:bg-[rgb(var(--color-bg-surface-4))]/80',
  ghost: 'bg-transparent text-[rgb(var(--color-text-muted))] border border-transparent hover:bg-[rgb(var(--color-bg-surface-3))] hover:text-[rgb(var(--color-text-secondary))] active:bg-[rgb(var(--color-bg-surface-3))]/80',
  danger: 'bg-[rgb(var(--color-danger-bg))] text-[rgb(var(--color-danger-text))] border border-[#5a2a2a] hover:bg-[#4a1f1f] active:bg-[#3a1515]',
};

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-md gap-1.5',
  md: 'px-4 py-2 text-sm rounded-md gap-2',
  lg: 'px-5 py-2.5 text-sm rounded-md gap-2',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, disabled, className, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-md px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-brand-default))] focus-visible:ring-offset-2 focus-visible:ring-offset-[rgb(var(--color-bg-base))]',
        variantStyles[variant],
        sizeStyles[size],
        className,
      )}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  ),
);
Button.displayName = 'Button';
