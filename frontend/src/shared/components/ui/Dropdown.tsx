'use client';
import { useState, useRef, useEffect, useCallback, type ReactNode, Fragment } from 'react';
import { cn } from '@/shared/utils/cn';

interface DropdownItem {
  key: string;
  label: string;
  onClick: () => void;
  danger?: boolean;
}

interface DropdownProps {
  trigger: ReactNode;
  items: DropdownItem[];
  align?: 'left' | 'right';
  className?: string;
}

export function Dropdown({ trigger, items, align = 'left', className }: DropdownProps) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);

  const close = useCallback(() => { setOpen(false); setActiveIndex(-1); }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [close]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) { if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); setActiveIndex(0); } return; }
    if (e.key === 'Escape') { close(); return; }
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex((i) => (i + 1) % items.length); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex((i) => (i - 1 + items.length) % items.length); }
    if (e.key === 'Enter' && activeIndex >= 0) { e.preventDefault(); items[activeIndex].onClick(); close(); }
  };

  return (
    <div ref={ref} className={cn('relative inline-block', className)} onKeyDown={handleKeyDown}>
      <div onClick={() => setOpen(!open)} role="button" tabIndex={0}>{trigger}</div>
      {open && (
        <div className={cn('absolute z-50 mt-1 mb-1 min-w-[180px] bg-[rgb(var(--color-bg-surface-2))] border border-[rgb(var(--color-border-default))] rounded-lg shadow-lg shadow-black/20 py-1', align === 'right' ? 'right-0' : 'left-0')}>
          {items.map((item, i) => (
            <Fragment key={item.key}>
              {i > 0 && <div className="border-t-[0.5px] border-[rgb(var(--color-border-subtle))] my-1"></div>}
              <button onClick={() => { item.onClick(); close(); }}
                className={cn(
                  'block w-full px-3 py-1.5 text-left text-[13px] transition-colors duration-150',
                  'focus-visible:outline-none focus-visible:bg-[rgb(var(--color-bg-surface-3))]',
                  i === activeIndex ? 'bg-[rgb(var(--color-bg-surface-3))]' : '',
                  item.danger
                    ? 'text-[rgb(var(--color-danger-text))] hover:bg-danger/10 active:bg-danger/20'
                    : 'text-[rgb(var(--color-text-secondary))] hover:bg-[rgb(var(--color-bg-surface-3))] hover:text-[rgb(var(--color-text-primary))]',
                )}>
                {item.label}
              </button>
            </Fragment>
          ))}
        </div>
      )}
    </div>
  );
}
