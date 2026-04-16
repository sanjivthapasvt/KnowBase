'use client';
import { useOrganizations } from '../hooks/useOrganizations';
import { useWorkspaceStore } from '@/store/workspace.store';
import { Dropdown } from '@/shared/components/ui/Dropdown';
import { Spinner } from '@/shared/components/ui/Spinner';

export function OrgSwitcher() {
  const { data, isLoading } = useOrganizations();
  const activeOrgId = useWorkspaceStore((s) => s.activeOrgId);
  const setActiveOrg = useWorkspaceStore((s) => s.setActiveOrg);

  const orgs = data?.items ?? [];
  const activeOrg = orgs.find((o) => o.id === activeOrgId);

  if (isLoading) return <Spinner size="sm" />;

  return (
    <Dropdown
      trigger={
        <div className="flex items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-sm text-foreground hover:bg-background transition-colors cursor-pointer">
          <span className="truncate">{activeOrg?.name ?? 'Select Organization'}</span>
          <svg className="h-4 w-4 shrink-0 text-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
        </div>
      }
      items={orgs.map((org) => ({
        key: org.id,
        label: org.name,
        onClick: () => setActiveOrg(org.id),
      }))}
    />
  );
}
