'use client';

import { useSearchParams } from 'next/navigation';
import { useWorkspaceStore } from '@/store/workspace.store';
import { WorkspaceDashboard } from '@/features/workspaces/components/WorkspaceDashboard';

export default function WorkspaceDetailClient({ workspaceId }: { workspaceId: string }) {
  const searchParams = useSearchParams();
  const orgIdParam = searchParams.get('org_id');
  const activeOrgId = useWorkspaceStore((s) => s.activeOrgId);
  const orgId = orgIdParam || activeOrgId;

  if (!orgId) return <p className="text-slate-400">No organization selected.</p>;

  return <WorkspaceDashboard orgId={orgId} workspaceId={workspaceId} />;
}
