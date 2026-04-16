// src/features/workspaces/components/CreateWorkspaceModal.tsx
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateWorkspaceSchema, type CreateWorkspaceFormData } from '../schemas';
import { useCreateWorkspace } from '../hooks/useWorkspaces';
import { Modal } from '@/shared/components/ui/Modal';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';

interface Props { isOpen: boolean; onClose: () => void; orgId: string; }

export function CreateWorkspaceModal({ isOpen, onClose, orgId }: Props) {
  const createWs = useCreateWorkspace(orgId);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateWorkspaceFormData>({
    resolver: zodResolver(CreateWorkspaceSchema),
  });

  const onSubmit = (data: CreateWorkspaceFormData) => {
    createWs.mutate(data, { onSuccess: () => { reset(); onClose(); } });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Workspace">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Name" placeholder="My Workspace" error={errors.name?.message} {...register('name')} />
        <Input label="Description" placeholder="Optional description" error={errors.description?.message} {...register('description')} />
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={createWs.isPending}>Create</Button>
        </div>
      </form>
    </Modal>
  );
}
