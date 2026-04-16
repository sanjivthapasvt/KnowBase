// src/app/(dashboard)/workspaces/[workspaceId]/page.tsx
'use client';
import { use } from 'react';
import { useSearchParams } from 'next/navigation';
import { useWorkspaceStore } from '@/store/workspace.store';
import { WorkspaceDashboard } from '@/features/workspaces/components/WorkspaceDashboard';

export default function WorkspaceDetailPage({ params }: { params: Promise<{ workspaceId: string }> }) {
  const { workspaceId } = use(params);
  const searchParams = useSearchParams();
  const orgIdParam = searchParams.get('org_id');
  const activeOrgId = useWorkspaceStore((s) => s.activeOrgId);
  const orgId = orgIdParam || activeOrgId;

  if (!orgId) return <p className="text-slate-400">No organization selected.</p>;

  return <WorkspaceDashboard orgId={orgId} workspaceId={workspaceId} />;
}
