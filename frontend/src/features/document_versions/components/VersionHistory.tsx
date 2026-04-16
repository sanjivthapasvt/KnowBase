'use client';
import { useState } from 'react';
import { useDocumentVersions, useDocumentVersion, useCreateDocumentVersion } from '../hooks/useDocumentVersions';
import { Spinner } from '@/shared/components/ui/Spinner';
import { Button } from '@/shared/components/ui/Button';
import { Modal } from '@/shared/components/ui/Modal';
import { Input } from '@/shared/components/ui/Input';
import { formatDateTime } from '@/shared/utils/formatDate';
import { cn } from '@/shared/utils/cn';

interface Props { orgId: string; documentId: string; }

export function VersionHistory({ orgId, documentId }: Props) {
  const { data, isLoading } = useDocumentVersions(orgId, documentId);
  const [selectedVersionId, setSelectedVersionId] = useState<string | null>(null);
  const { data: selectedVersion } = useDocumentVersion(orgId, documentId, selectedVersionId || '');
  const createVersion = useCreateDocumentVersion(orgId, documentId);
  const [showCreate, setShowCreate] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');

  if (isLoading) return <div className="flex justify-center py-12"><Spinner size="lg" /></div>;

  const versions = data?.items ?? [];

  return (
    <div className="flex gap-4 min-h-[500px]">
      <div className="w-64 shrink-0 space-y-1">
        <Button size="sm" className="w-full mb-3" onClick={() => setShowCreate(true)}>
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
          New Version
        </Button>
        {versions.length === 0 ? (
          <p className="text-sm text-muted">No versions yet.</p>
        ) : (
          versions.map((v) => (
            <button key={v.id} onClick={() => setSelectedVersionId(v.id)}
              className={cn('w-full rounded-md border p-3 text-left transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-1 focus-visible:ring-offset-surface active:scale-[0.98]',
                selectedVersionId === v.id
                  ? 'border-accent bg-accent/10'
                  : 'border-border bg-surface hover:border-accent/40')}>
              <p className="text-sm font-medium text-foreground">v{v.version_number}</p>
              <p className="text-xs text-muted mt-0.5 line-clamp-1">{v.title}</p>
              <p className="text-xs text-muted/70 mt-0.5">{formatDateTime(v.created_at)}</p>
            </button>
          ))
        )}
      </div>

      <div className="flex-1 rounded-lg border border-border bg-surface p-6">
        {selectedVersion ? (
          <div>
            <h3 className="text-base font-semibold text-foreground mb-0.5">v{selectedVersion.version_number}: {selectedVersion.title}</h3>
            <p className="text-xs text-muted mb-4">{formatDateTime(selectedVersion.created_at)}</p>
            <pre className="whitespace-pre-wrap text-sm text-foreground bg-background rounded-md p-4 border border-border">{selectedVersion.content}</pre>
          </div>
        ) : (
          <p className="text-muted text-sm text-center py-12">Select a version to view its content.</p>
        )}
      </div>

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Version">
        <form onSubmit={(e) => { e.preventDefault(); createVersion.mutate({ title: newTitle, content: newContent }, { onSuccess: () => { setShowCreate(false); setNewTitle(''); setNewContent(''); } }); }} className="space-y-4">
          <Input label="Title" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} placeholder="Version title" />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Content</label>
            <textarea value={newContent} onChange={(e) => setNewContent(e.target.value)} rows={10} placeholder="Version content..."
              className="block w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:ring-offset-background resize-y" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button type="submit" loading={createVersion.isPending}>Create Version</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
