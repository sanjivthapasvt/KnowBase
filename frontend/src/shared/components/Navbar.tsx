'use client';
import { useCurrentUser } from '@/features/users/hooks/useCurrentUser';
import { Dropdown } from '@/shared/components/ui/Dropdown';
import { useAuth } from '@/features/auth/hooks/useAuth';

export function Navbar() {
  const { data: user } = useCurrentUser();
  const { logout } = useAuth();

  const initials = user?.full_name?.split(' ').map((n) => n[0]).join('').toUpperCase() || '?';

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-end border-b-[0.5px] border-[rgb(var(--color-border-subtle))] bg-[rgb(var(--color-bg-surface-1))] px-6">
      <Dropdown
        align="right"
        trigger={
          <div className="flex items-center gap-2.5 cursor-pointer rounded-md px-2 py-1.5 text-[rgb(var(--color-text-muted))] transition-colors duration-150 hover:bg-[rgb(var(--color-bg-surface-3))] hover:text-[rgb(var(--color-text-secondary))] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-border-focus))] focus-visible:ring-offset-1 focus-visible:ring-offset-[rgb(var(--color-bg-surface-1))]">
            <div className="h-7 w-7 rounded-full bg-[rgb(var(--color-brand-default))] text-white flex items-center justify-center">
              <span className="text-xs font-medium">{initials}</span>
            </div>
            <span className="text-sm hidden sm:inline">{user?.full_name ?? 'Loading...'}</span>
          </div>
        }
        items={[
          { key: 'logout', label: 'Sign Out', onClick: () => logout(), danger: true },
        ]}
      />
    </header>
  );
}
