'use client';
import { useState, useEffect } from 'react';
import { useDocument, useUpdateDocument } from '../hooks/useDocument';
import { useDebounce } from '@/shared/hooks/useDebounce';
import { Spinner } from '@/shared/components/ui/Spinner';
import { Badge } from '@/shared/components/ui/Badge';
import { Button } from '@/shared/components/ui/Button';
import type { DocumentStatus } from '../types';

const statusVariant: Record<DocumentStatus, 'default' | 'success' | 'warning' | 'danger'> = {
  draft: 'warning', published: 'success', archived: 'default',
};

interface Props { orgId: string; documentId: string; }

export function DocumentEditor({ orgId, documentId }: Props) {
  const { data: doc, isLoading } = useDocument(orgId, documentId);
  const updateDoc = useUpdateDocument(orgId, documentId);
  const [title, setTitle] = useState('');
  const debouncedTitle = useDebounce(title, 1000);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (doc && !initialized) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setTitle(doc.title);
      setInitialized(true);
    }
  }, [doc, initialized]);

  useEffect(() => {
    if (initialized && debouncedTitle && debouncedTitle !== doc?.title) {
      updateDoc.mutate({ title: debouncedTitle });
    }
  }, [debouncedTitle]); // eslint-disable-line react-hooks/exhaustive-deps

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;
  if (!doc) return <p className="text-muted">Document not found.</p>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Badge variant={statusVariant[doc.status]}>{doc.status}</Badge>
        <div className="flex gap-2">
          {doc.status === 'draft' && (
            <Button size="sm" onClick={() => updateDoc.mutate({ status: 'published' })} loading={updateDoc.isPending}>Publish</Button>
          )}
          {doc.status === 'published' && (
            <Button size="sm" variant="secondary" onClick={() => updateDoc.mutate({ status: 'archived' })} loading={updateDoc.isPending}>Archive</Button>
          )}
        </div>
      </div>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full bg-transparent text-xl font-semibold text-foreground placeholder:text-muted/50 focus:outline-none border-none"
        placeholder="Document title..."
      />
      <div className="rounded-lg border border-border bg-surface p-6 min-h-[400px]">
        <p className="text-sm text-muted">Document content is managed through versions. Visit the versions tab to view or create content.</p>
      </div>
    </div>
  );
}
