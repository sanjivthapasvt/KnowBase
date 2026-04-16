// theme: dark schema applied
'use client';
import { useMemberships, useRemoveMember } from '../hooks/useMemberships';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import { Spinner } from '@/shared/components/ui/Spinner';
import type { RoleEnum } from '../types';

const roleBadgeVariant: Record<RoleEnum, 'default' | 'success' | 'warning' | 'danger'> = {
  owner: 'danger',
  admin: 'warning',
  member: 'success',
  viewer: 'default',
};

interface Props { orgId: string; }

export function MemberList({ orgId }: Props) {
  const { data, isLoading } = useMemberships(orgId);
  const removeMember = useRemoveMember(orgId);

  if (isLoading) return <div className="flex justify-center py-8"><Spinner /></div>;

  const members = data?.items ?? [];

  return (
    <div className="overflow-x-auto rounded-xl bg-[rgb(var(--color-bg-surface-2))] overflow-hidden border border-[rgb(var(--color-border-default))]">
      {members.length === 0 ? (
        <div className="p-4"><p className="text-[rgb(var(--color-text-muted))] text-[13px]">No members found.</p></div>
      ) : (
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[rgb(var(--color-bg-surface-1))] text-[rgb(var(--color-text-muted))] text-[11px] font-medium uppercase tracking-wider">
              <th className="px-3.5 py-2.5 text-left">User</th>
              <th className="px-3.5 py-2.5 text-left">Role</th>
              <th className="px-3.5 py-2.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.id} className="border-b-[0.5px] border-[rgb(var(--color-border-subtle))] text-[rgb(var(--color-text-secondary))] transition-colors duration-150 hover:bg-[rgb(var(--color-bg-surface-3))] active:bg-[rgb(var(--color-bg-surface-4))] active:text-[rgb(var(--color-text-primary))]">
                <td className="px-3.5 py-2.5 text-[13px]">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-[rgb(var(--color-brand-subtle))] text-[rgb(var(--color-brand-light))] flex items-center justify-center">
                      <span className="text-xs font-medium">{m.user_id.slice(0, 2).toUpperCase()}</span>
                    </div>
                    <span className="font-medium text-[rgb(var(--color-text-primary))]">User {m.user_id.slice(0, 8)}</span>
                  </div>
                </td>
                <td className="px-3.5 py-2.5 text-[13px]">
                  <Badge variant={roleBadgeVariant[m.role]}>{m.role}</Badge>
                </td>
                <td className="px-3.5 py-2.5 text-[13px] text-right">
                  {m.role !== 'owner' && (
                    <Button variant="ghost" size="sm" onClick={() => removeMember.mutate(m.id)} loading={removeMember.isPending}>
                      Remove
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
