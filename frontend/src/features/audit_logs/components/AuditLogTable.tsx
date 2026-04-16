'use client';
import { useAuditLogs } from '../hooks/useAuditLogs';
import { Spinner } from '@/shared/components/ui/Spinner';
import { Badge } from '@/shared/components/ui/Badge';
import { formatDateTime } from '@/shared/utils/formatDate';

interface Props { orgId: string; }

export function AuditLogTable({ orgId }: Props) {
  const { data, isLoading } = useAuditLogs(orgId);

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

  const logs = data?.items ?? [];

  if (logs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[rgb(var(--color-border-default))] p-12 text-center">
        <p className="text-sm text-[rgb(var(--color-text-muted))]">No audit logs found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl bg-[rgb(var(--color-bg-surface-2))] overflow-hidden border border-[rgb(var(--color-border-default))]">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-[rgb(var(--color-bg-surface-1))] text-[rgb(var(--color-text-muted))] text-[11px] font-medium uppercase tracking-wider">
            <th className="px-3.5 py-2.5 text-left">Action</th>
            <th className="px-3.5 py-2.5 text-left">Resource</th>
            <th className="px-3.5 py-2.5 text-left">User</th>
            <th className="px-3.5 py-2.5 text-left">Details</th>
            <th className="px-3.5 py-2.5 text-left">Time</th>
          </tr>
        </thead>
        <tbody>
          {logs.map((log) => (
            <tr key={log.id} className="border-b-[0.5px] border-[rgb(var(--color-border-subtle))] text-[rgb(var(--color-text-secondary))] transition-colors duration-150 hover:bg-[rgb(var(--color-bg-surface-3))] active:bg-[rgb(var(--color-bg-surface-4))] active:text-[rgb(var(--color-text-primary))]">
              <td className="px-3.5 py-2.5 text-[13px]"><Badge>{log.action}</Badge></td>
              <td className="px-3.5 py-2.5 text-[13px]">{log.resource_type}</td>
              <td className="px-3.5 py-2.5 text-[13px] font-mono text-xs">{log.user_id.slice(0, 8)}...</td>
              <td className="px-3.5 py-2.5 text-[13px] max-w-xs truncate">{log.details ?? '—'}</td>
              <td className="px-3.5 py-2.5 text-[13px] whitespace-nowrap">{formatDateTime(log.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
