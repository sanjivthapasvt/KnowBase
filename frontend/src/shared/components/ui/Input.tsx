'use client';
import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/shared/utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');
    return (
      <div className="space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-sm font-medium text-[rgb(var(--color-text-primary))]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'block w-full bg-[rgb(var(--color-bg-surface-3))] text-[rgb(var(--color-text-primary))] border border-[rgb(var(--color-border-default))] rounded-md px-2.5 py-[7px] text-[13px] placeholder:text-[rgb(var(--color-text-muted))] hover:border-[#3a4255] focus:border-[rgb(var(--color-border-focus))] focus:ring-2 focus:ring-[rgb(var(--color-brand-default))]/20 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150',
            error ? 'border-[rgb(var(--color-danger-text))] focus:ring-[rgb(var(--color-danger-text))]' : '',
            className,
          )}
          {...props}
        />
        {error && <p className="text-xs text-[rgb(var(--color-danger-text))]">{error}</p>}
      </div>
    );
  },
);
Input.displayName = 'Input';
