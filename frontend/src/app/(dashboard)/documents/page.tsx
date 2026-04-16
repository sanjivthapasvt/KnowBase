'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useWorkspaceStore } from '@/store/workspace.store';
import { useWorkspaces } from '@/features/workspaces/hooks/useWorkspaces';
import { useCreateDocument } from '@/features/documents/hooks/useDocuments';
import { DocumentList } from '@/features/documents/components/DocumentList';
import { Button } from '@/shared/components/ui/Button';
import { Modal } from '@/shared/components/ui/Modal';
import { Input } from '@/shared/components/ui/Input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateDocumentSchema, type CreateDocumentFormData } from '@/features/documents/schemas';
import { WorkspaceSwitcher } from '@/features/workspaces/components/WorkspaceSwitcher';

export default function DocumentsPage() {
  const searchParams = useSearchParams();
  const orgIdParam = searchParams.get('org_id');
  const wsIdParam = searchParams.get('workspace_id');
  const activeOrgId = useWorkspaceStore((s) => s.activeOrgId);
  const activeWsId = useWorkspaceStore((s) => s.activeWorkspaceId);
  const orgId = orgIdParam || activeOrgId;
  const workspaceId = wsIdParam || activeWsId;
  const [showCreate, setShowCreate] = useState(false);
  const createDoc = useCreateDocument(orgId || '');
  const { data: wsData } = useWorkspaces(orgId);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateDocumentFormData>({
    resolver: zodResolver(CreateDocumentSchema),
    defaultValues: { workspace_id: workspaceId || '', status: 'draft' as const },
  });

  if (!orgId) {
    return (
      <div className="rounded-lg border border-dashed border-border p-12 text-center">
        <p className="text-sm text-muted">Please select an organization first.</p>
        <Link href="/organizations" className="mt-3 inline-block text-sm text-accent hover:underline">Go to Organizations</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-lg font-semibold text-foreground">Documents</h1>
          <p className="mt-0.5 text-sm text-muted">Browse and manage documents</p>
        </div>
        <div className="flex items-center gap-2">
          <WorkspaceSwitcher />
          <Button onClick={() => setShowCreate(true)} size="sm">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
            New Document
          </Button>
        </div>
      </div>
      <DocumentList orgId={orgId} workspaceId={workspaceId} />
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create Document">
        <form onSubmit={handleSubmit((data) => createDoc.mutate(data, { onSuccess: () => { reset(); setShowCreate(false); } }))} className="space-y-4">
          <Input label="Title" placeholder="Document title" error={errors.title?.message} {...register('title')} />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-foreground">Workspace</label>
            <select {...register('workspace_id')} className="block w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:ring-offset-background">
              <option value="">Select workspace</option>
              {(wsData?.items ?? []).map((ws) => <option key={ws.id} value={ws.id}>{ws.name}</option>)}
            </select>
            {errors.workspace_id && <p className="text-xs text-danger">{errors.workspace_id.message}</p>}
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" type="button" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button type="submit" loading={createDoc.isPending}>Create</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
