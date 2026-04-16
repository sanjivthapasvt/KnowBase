// theme: dark schema applied
'use client';
import { useDocuments } from '../hooks/useDocuments';
import { DocumentCard } from './DocumentCard';
import { Spinner } from '@/shared/components/ui/Spinner';

interface Props { orgId: string; workspaceId?: string | null; }

export function DocumentList({ orgId, workspaceId }: Props) {
  const { data, isLoading } = useDocuments(orgId, workspaceId);

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

  const docs = data?.items ?? [];

  if (docs.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-[rgb(var(--color-border-default))] p-12 text-center bg-[rgb(var(--color-bg-surface-2))]">
        <p className="text-[13px] text-[rgb(var(--color-text-muted))]">No documents found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {docs.map((doc) => (
        <DocumentCard key={doc.id} doc={doc} orgId={orgId} />
      ))}
    </div>
  );
}
