'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useWorkspaces } from '@/features/workspaces/hooks/useWorkspaces';
import { CreateWorkspaceModal } from '@/features/workspaces/components/CreateWorkspaceModal';
import { useWorkspaceStore } from '@/store/workspace.store';
import { Button } from '@/shared/components/ui/Button';
import { Spinner } from '@/shared/components/ui/Spinner';
import { formatRelativeTime } from '@/shared/utils/formatDate';

export default function WorkspacesPage() {
  const searchParams = useSearchParams();
  const orgIdParam = searchParams.get('org_id');
  const activeOrgId = useWorkspaceStore((s) => s.activeOrgId);
  const orgId = orgIdParam || activeOrgId;
  const [showCreate, setShowCreate] = useState(false);
  const { data, isLoading } = useWorkspaces(orgId);

  if (!orgId) {
    return (
      <div className="rounded-lg border border-dashed border-border p-12 text-center">
        <p className="text-sm text-muted">Please select an organization first.</p>
        <Link href="/organizations" className="mt-3 inline-block text-sm text-accent hover:underline">Go to Organizations</Link>
      </div>
    );
  }

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  const workspaces = data?.items ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Workspaces</h1>
          <p className="mt-0.5 text-sm text-muted">Manage your team workspaces</p>
        </div>
        <Button onClick={() => setShowCreate(true)} size="sm">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Workspace
        </Button>
      </div>
      {workspaces.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-sm text-muted">No workspaces yet.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((ws) => (
            <Link key={ws.id} href={`/workspaces/${ws.id}?org_id=${orgId}`}
              className="block rounded-lg border border-border bg-surface p-5 transition-all duration-150 hover:border-accent/40 active:bg-background/80 active:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-background">
              <h3 className="text-sm font-medium text-foreground">{ws.name}</h3>
              {ws.description && <p className="mt-1 text-xs text-muted line-clamp-2">{ws.description}</p>}
              <p className="mt-2 text-xs text-muted/70">Created {formatRelativeTime(ws.created_at)}</p>
            </Link>
          ))}
        </div>
      )}
      <CreateWorkspaceModal isOpen={showCreate} onClose={() => setShowCreate(false)} orgId={orgId} />
    </div>
  );
}
