'use client';
import { useWorkspaces } from '../hooks/useWorkspaces';
import { useWorkspaceStore } from '@/store/workspace.store';
import { Dropdown } from '@/shared/components/ui/Dropdown';
import { Spinner } from '@/shared/components/ui/Spinner';

export function WorkspaceSwitcher() {
  const activeOrgId = useWorkspaceStore((s) => s.activeOrgId);
  const activeWorkspaceId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const setActiveWorkspace = useWorkspaceStore((s) => s.setActiveWorkspace);
  const { data, isLoading } = useWorkspaces(activeOrgId);

  const workspaces = data?.items ?? [];
  const activeWs = workspaces.find((w) => w.id === activeWorkspaceId);

  if (!activeOrgId) return null;
  if (isLoading) return <Spinner size="sm" />;

  return (
    <Dropdown
      trigger={
        <div className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-foreground hover:bg-background transition-colors cursor-pointer">
          <span className="truncate">{activeWs?.name ?? 'All Workspaces'}</span>
          <svg className="h-4 w-4 shrink-0 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </div>
      }
      items={[
        { key: 'all', label: 'All Workspaces', onClick: () => setActiveWorkspace(null) },
        ...workspaces.map((ws) => ({ key: ws.id, label: ws.name, onClick: () => setActiveWorkspace(ws.id) })),
      ]}
    />
  );
}
