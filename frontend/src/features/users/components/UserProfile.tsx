'use client';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { Spinner } from '@/shared/components/ui/Spinner';
import { Badge } from '@/shared/components/ui/Badge';
import { formatDate } from '@/shared/utils/formatDate';

export function UserProfile() {
  const { data: user, isLoading } = useCurrentUser();
  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
  if (!user) return null;

  return (
    <div className="rounded-lg border border-border bg-surface p-5">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-full bg-accent/15 text-accent flex items-center justify-center">
          <span className="text-base font-semibold">{user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}</span>
        </div>
        <div>
          <h3 className="text-sm font-semibold text-foreground">{user.full_name}</h3>
          <p className="text-xs text-muted">{user.email}</p>
          <Badge variant={user.is_active ? 'success' : 'danger'} className="mt-1">{user.is_active ? 'Active' : 'Inactive'}</Badge>
        </div>
      </div>
      <div className="mt-4 pt-3 border-t border-border text-xs text-muted">
        Joined {formatDate(user.created_at)}
      </div>
    </div>
  );
}
