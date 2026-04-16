'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useOrganizations } from '@/features/organizations/hooks/useOrganizations';
import { CreateOrgModal } from '@/features/organizations/components/CreateOrgModal';
import { Button } from '@/shared/components/ui/Button';
import { Spinner } from '@/shared/components/ui/Spinner';
import { Badge } from '@/shared/components/ui/Badge';
import { formatRelativeTime } from '@/shared/utils/formatDate';
import { useWorkspaceStore } from '@/store/workspace.store';

export default function OrganizationsPage() {
  const [showCreate, setShowCreate] = useState(false);
  const { data, isLoading } = useOrganizations();
  const setActiveOrg = useWorkspaceStore((s) => s.setActiveOrg);

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  const orgs = data?.items ?? [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Organizations</h1>
          <p className="mt-0.5 text-sm text-muted">Manage your organizations and teams</p>
        </div>
        <Button onClick={() => setShowCreate(true)} size="sm">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Organization
        </Button>
      </div>

      {orgs.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border p-12 text-center">
          <p className="text-sm text-muted">No organizations yet. Create one to get started.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {orgs.map((org) => (
            <Link key={org.id} href={`/organizations/${org.id}`} onClick={() => setActiveOrg(org.id)}
              className="group block rounded-lg border border-border bg-surface p-5 transition-all duration-150 hover:border-accent/40 active:bg-background/80 active:border-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-background">
              <div className="flex items-start justify-between">
                <div className="h-9 w-9 rounded-md bg-accent/15 text-accent flex items-center justify-center">
                  <span className="text-sm font-semibold">{org.name[0].toUpperCase()}</span>
                </div>
                <Badge variant={org.is_active ? 'success' : 'danger'}>{org.is_active ? 'Active' : 'Inactive'}</Badge>
              </div>
              <h3 className="mt-3 text-sm font-medium text-foreground">{org.name}</h3>
              {org.description && <p className="mt-1 text-xs text-muted line-clamp-2">{org.description}</p>}
              <p className="mt-2 text-xs text-muted/70">Created {formatRelativeTime(org.created_at)}</p>
            </Link>
          ))}
        </div>
      )}

      <CreateOrgModal isOpen={showCreate} onClose={() => setShowCreate(false)} />
    </div>
  );
}
