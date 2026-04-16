'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/shared/utils/cn';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { useWorkspaceStore } from '@/store/workspace.store';

const navItems = [
  { href: '/organizations', label: 'Organizations', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { href: '/workspaces', label: 'Workspaces', icon: 'M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
  { href: '/documents', label: 'Documents', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
  { href: '/audit-logs', label: 'Audit Logs', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { logout, isLoggingOut } = useAuth();
  const activeOrgId = useWorkspaceStore((s) => s.activeOrgId);

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex w-60 flex-col border-r border-[rgb(var(--color-border-default))] bg-[rgb(var(--color-bg-surface-1))] h-full">
      <div className="flex h-14 items-center gap-2.5 border-b-[0.5px] border-[rgb(var(--color-border-subtle))] px-5">
        <div className="h-7 w-7 rounded-md bg-[rgb(var(--color-brand-default))] flex items-center justify-center">
          <span className="text-xs font-bold text-white">K</span>
        </div>
        <span className="text-sm font-semibold text-[rgb(var(--color-text-primary))]">KnowBase</span>
      </div>

      <nav className="flex-1 space-y-0.5 px-3 py-3 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname.startsWith(item.href);
          const href = (item.href === '/workspaces' || item.href === '/documents')
            ? activeOrgId ? `/organizations/${activeOrgId}` : item.href
            : item.href;
          return (
            <Link key={item.href} href={href}
              className={cn(
                'group relative flex items-center gap-2.5 px-3 py-2 text-sm transition-colors duration-150',
                'focus-visible:bg-[rgb(var(--color-brand-subtle))] focus-visible:text-[rgb(var(--color-text-primary))] focus-visible:outline-2 focus-visible:outline-[rgb(var(--color-border-focus))]',
                isActive
                  ? 'bg-[rgb(var(--color-bg-surface-3))] text-[rgb(var(--color-text-link))] font-medium border-l-2 border-[rgb(var(--color-brand-default))] rounded-r-md'
                  : 'text-[rgb(var(--color-text-muted))] rounded-md hover:bg-[rgb(var(--color-bg-surface-3))] hover:text-[rgb(var(--color-text-secondary))]',
              )}>
              <svg className={cn('h-4 w-4 shrink-0 transition-colors duration-150', isActive ? 'text-[rgb(var(--color-brand-default))]' : 'text-[rgb(var(--color-text-muted))] group-hover:text-[rgb(var(--color-text-secondary))]')} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t-[0.5px] border-[rgb(var(--color-border-subtle))] p-3">
        <button onClick={() => logout()} disabled={isLoggingOut}
          className={cn(
            'flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-sm text-[rgb(var(--color-text-muted))] transition-colors duration-150',
            'hover:bg-[rgb(var(--color-danger-bg))] hover:text-[rgb(var(--color-danger-text))] active:bg-danger/20',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger focus-visible:ring-offset-1 focus-visible:ring-offset-surface',
            'disabled:opacity-50 disabled:pointer-events-none',
          )}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
          </svg>
          Sign Out
        </button>
      </div>
    </aside>
  );
}
