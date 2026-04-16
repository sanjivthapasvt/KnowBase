'use client';
import { useEffect, useRef, useCallback, type ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}

export function Modal({ isOpen, onClose, title, children, className }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
    if (e.key === 'Tab' && contentRef.current) {
      const focusable = contentRef.current.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }, [onClose]);

  useEffect(() => {
    if (!isOpen) return;
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) return null;

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm" onClick={(e) => { if (e.target === overlayRef.current) onClose(); }}>
      <div ref={contentRef} role="dialog" aria-modal="true" className={cn('relative z-10 w-full max-w-lg bg-[rgb(var(--color-bg-surface-2))] border border-[rgb(var(--color-border-default))] rounded-xl p-6 shadow-lg shadow-black/20', className)}>
        <div className="mb-4 flex items-center justify-between border-b-[0.5px] border-[rgb(var(--color-border-subtle))] pb-4">
          <h2 className="text-[rgb(var(--color-text-primary))] text-base font-medium">{title}</h2>
          <button onClick={onClose} className="rounded-md px-3.5 py-1.5 text-[13px] font-medium transition-colors duration-150 cursor-pointer disabled:opacity-50 disabled:pointer-events-none bg-transparent text-[rgb(var(--color-text-muted))] border border-transparent hover:bg-[rgb(var(--color-bg-surface-3))] hover:text-[rgb(var(--color-text-secondary))] active:bg-[rgb(var(--color-bg-surface-3))]/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-border-focus))] focus-visible:ring-offset-1 focus-visible:ring-offset-[rgb(var(--color-bg-surface-2))]">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          </button>
        </div>
        <div className="text-[rgb(var(--color-text-secondary))] text-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
