'use client';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useWorkspaceStore } from '@/store/workspace.store';
import { AuditLogTable } from '@/features/audit_logs/components/AuditLogTable';

export default function AuditLogsPage() {
  const searchParams = useSearchParams();
  const orgIdParam = searchParams.get('org_id');
  const activeOrgId = useWorkspaceStore((s) => s.activeOrgId);
  const orgId = orgIdParam || activeOrgId;

  if (!orgId) {
    return (
      <div className="rounded-lg border border-dashed border-border p-12 text-center">
        <p className="text-sm text-muted">No organization selected.</p>
        <Link href="/organizations" className="mt-3 inline-block text-sm text-accent hover:underline">Go to Organizations</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-lg font-semibold text-foreground">Audit Logs</h1>
        <p className="mt-0.5 text-sm text-muted">Activity history for your organization</p>
      </div>
      <AuditLogTable orgId={orgId} />
    </div>
  );
}
