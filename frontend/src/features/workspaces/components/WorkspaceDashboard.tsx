'use client';
import { useWorkspace } from '../hooks/useWorkspace';
import { Spinner } from '@/shared/components/ui/Spinner';
import { formatDate } from '@/shared/utils/formatDate';
import Link from 'next/link';

interface Props { orgId: string; workspaceId: string; }

export function WorkspaceDashboard({ orgId, workspaceId }: Props) {
  const { data: ws, isLoading } = useWorkspace(orgId, workspaceId);

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
  if (!ws) return <p className="text-muted">Workspace not found.</p>;

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-foreground">{ws.name}</h2>
        {ws.description && <p className="mt-1 text-sm text-muted">{ws.description}</p>}
        <p className="mt-1 text-xs text-muted/70">Created {formatDate(ws.created_at)} · Slug: {ws.slug}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Link href={`/documents?org_id=${orgId}&workspace_id=${workspaceId}`}
          className="block rounded-lg border border-border bg-surface p-5 transition-all duration-150 hover:border-accent/40 active:bg-background/80 active:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-background">
          <h3 className="text-sm font-medium text-foreground">Documents</h3>
          <p className="mt-1 text-xs text-muted">View workspace documents</p>
        </Link>
        <Link href={`/workspaces/${workspaceId}/members?org_id=${orgId}`}
          className="block rounded-lg border border-border bg-surface p-5 transition-all duration-150 hover:border-accent/40 active:bg-background/80 active:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-background">
          <h3 className="text-sm font-medium text-foreground">Members</h3>
          <p className="mt-1 text-xs text-muted">Manage workspace members</p>
        </Link>
      </div>
    </div>
  );
}
