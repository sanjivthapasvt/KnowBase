'use client';
import { cn } from '@/shared/utils/cn';

type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantStyles: Record<BadgeVariant, string> = {
  info: 'bg-[rgb(var(--color-info-bg))] text-[rgb(var(--color-info-text))]',
  success: 'bg-[rgb(var(--color-success-bg))] text-[rgb(var(--color-success-text))]',
  warning: 'bg-[rgb(var(--color-warning-bg))] text-[rgb(var(--color-warning-text))]',
  danger: 'bg-[rgb(var(--color-danger-bg))] text-[rgb(var(--color-danger-text))]',
  purple: 'bg-[rgb(var(--color-purple-bg))] text-[rgb(var(--color-purple-text))]',
  default: 'bg-[rgb(var(--color-bg-surface-3))] text-[rgb(var(--color-text-secondary))]',
};

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  return (
    <span className={cn('inline-block text-[11px] font-medium px-2 py-0.5 rounded', variantStyles[variant], className)}>
      {children}
    </span>
  );
}
