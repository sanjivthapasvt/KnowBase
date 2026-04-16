'use client';
import { use } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useWorkspaceStore } from '@/store/workspace.store';
import { DocumentEditor } from '@/features/documents/components/DocumentEditor';
import { Button } from '@/shared/components/ui/Button';

export default function DocumentDetailPage({ params }: { params: Promise<{ documentId: string }> }) {
  const { documentId } = use(params);
  const searchParams = useSearchParams();
  const orgIdParam = searchParams.get('org_id');
  const activeOrgId = useWorkspaceStore((s) => s.activeOrgId);
  const orgId = orgIdParam || activeOrgId;

  if (!orgId) return <p className="text-muted">No organization selected.</p>;

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <Link href={`/documents?org_id=${orgId}`} className="text-muted hover:text-foreground transition-colors">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
        </Link>
        <Link href={`/documents/${documentId}/versions?org_id=${orgId}`}>
          <Button variant="ghost" size="sm">Version History</Button>
        </Link>
      </div>
      <DocumentEditor orgId={orgId} documentId={documentId} />
    </div>
  );
}
