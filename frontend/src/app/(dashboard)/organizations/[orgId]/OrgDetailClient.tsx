'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { useOrganization } from '@/features/organizations/hooks/useOrganization';
import { useWorkspaceStore } from '@/store/workspace.store';
import { Spinner } from '@/shared/components/ui/Spinner';
import { Badge } from '@/shared/components/ui/Badge';
import { formatDate } from '@/shared/utils/formatDate';

export default function OrgDetailClient({ orgId }: { orgId: string }) {
  const { data: org, isLoading } = useOrganization(orgId);
  const setActiveOrg = useWorkspaceStore((s) => s.setActiveOrg);

  useEffect(() => { if (orgId) setActiveOrg(orgId); }, [orgId, setActiveOrg]);

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!org) return <p className="text-muted">Organization not found.</p>;

  return (
    <div>
      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-1">
          <h1 className="text-lg font-semibold text-foreground">{org.name}</h1>
          <Badge variant={org.is_active ? 'success' : 'danger'}>{org.is_active ? 'Active' : 'Inactive'}</Badge>
        </div>
        {org.description && <p className="text-sm text-muted">{org.description}</p>}
        <p className="mt-1 text-xs text-muted/70">Created {formatDate(org.created_at)} · Slug: {org.slug}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Link href={`/workspaces?org_id=${orgId}`}
          className="block rounded-lg border border-border bg-surface p-5 transition-all duration-150 hover:border-accent/40 active:bg-background/80 active:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-background">
          <h3 className="text-sm font-medium text-foreground">Workspaces</h3>
          <p className="mt-1 text-xs text-muted">Manage workspaces</p>
        </Link>
        <Link href={`/documents?org_id=${orgId}`}
          className="block rounded-lg border border-border bg-surface p-5 transition-all duration-150 hover:border-accent/40 active:bg-background/80 active:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-background">
          <h3 className="text-sm font-medium text-foreground">Documents</h3>
          <p className="mt-1 text-xs text-muted">Browse documents</p>
        </Link>
        <Link href={`/audit-logs?org_id=${orgId}`}
          className="block rounded-lg border border-border bg-surface p-5 transition-all duration-150 hover:border-accent/40 active:bg-background/80 active:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-background">
          <h3 className="text-sm font-medium text-foreground">Audit Logs</h3>
          <p className="mt-1 text-xs text-muted">Activity history</p>
        </Link>
      </div>
    </div>
  );
}
