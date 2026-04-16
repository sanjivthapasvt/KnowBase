// src/features/organizations/components/CreateOrgModal.tsx
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateOrgSchema, type CreateOrgFormData } from '../schemas';
import { useCreateOrganization } from '../hooks/useOrganizations';
import { Modal } from '@/shared/components/ui/Modal';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';

interface Props { isOpen: boolean; onClose: () => void; }

export function CreateOrgModal({ isOpen, onClose }: Props) {
  const createOrg = useCreateOrganization();
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateOrgFormData>({
    resolver: zodResolver(CreateOrgSchema),
  });

  const onSubmit = (data: CreateOrgFormData) => {
    createOrg.mutate(data, { onSuccess: () => { reset(); onClose(); } });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Organization">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Name" placeholder="My Organization" error={errors.name?.message} {...register('name')} />
        <Input label="Description" placeholder="Optional description" error={errors.description?.message} {...register('description')} />
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={createOrg.isPending}>Create</Button>
        </div>
      </form>
    </Modal>
  );
}
