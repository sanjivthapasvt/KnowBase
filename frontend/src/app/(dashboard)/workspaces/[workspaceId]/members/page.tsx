'use client';
import { use, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useWorkspaceStore } from '@/store/workspace.store';
import { MemberList } from '@/features/memberships/components/MemberList';
import { InviteMemberModal } from '@/features/invites/components/InviteMemberModal';
import { Button } from '@/shared/components/ui/Button';

export default function MembersPage({ params }: { params: Promise<{ workspaceId: string }> }) {
  const { workspaceId } = use(params);
  const searchParams = useSearchParams();
  const orgIdParam = searchParams.get('org_id');
  const activeOrgId = useWorkspaceStore((s) => s.activeOrgId);
  const orgId = orgIdParam || activeOrgId;
  const [showInvite, setShowInvite] = useState(false);

  if (!orgId) return <p className="text-muted">No organization selected.</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg font-semibold text-foreground">Members</h1>
        <Button onClick={() => setShowInvite(true)} size="sm">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          Invite Member
        </Button>
      </div>
      <MemberList orgId={orgId} />
      <InviteMemberModal isOpen={showInvite} onClose={() => setShowInvite(false)} orgId={orgId} />
    </div>
  );
}
