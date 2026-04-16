'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { InviteSchema, type InviteFormData } from '../schemas';
import { useCreateInvite } from '../hooks/useInvites';
import { Modal } from '@/shared/components/ui/Modal';
import { Input } from '@/shared/components/ui/Input';
import { Button } from '@/shared/components/ui/Button';

interface Props { isOpen: boolean; onClose: () => void; orgId: string; }

export function InviteMemberModal({ isOpen, onClose, orgId }: Props) {
  const createInvite = useCreateInvite(orgId);
  const { register, handleSubmit, reset, formState: { errors } } = useForm<InviteFormData>({
    resolver: zodResolver(InviteSchema),
    defaultValues: { role: 'member' },
  });

  const onSubmit = (data: InviteFormData) => {
    createInvite.mutate(data, { onSuccess: () => { reset(); onClose(); } });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Invite Member">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input label="Email" type="email" placeholder="member@example.com" error={errors.email?.message} {...register('email')} />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-foreground">Role</label>
          <select {...register('role')} className="block w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-1 focus:ring-offset-background">
            <option value="member">Member</option>
            <option value="admin">Admin</option>
            <option value="viewer">Viewer</option>
          </select>
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={createInvite.isPending}>Send Invite</Button>
        </div>
      </form>
    </Modal>
  );
}
