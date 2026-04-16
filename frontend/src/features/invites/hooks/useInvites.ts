// src/features/invites/hooks/useInvites.ts
'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invitesApi } from '../api';
import type { CreateInvite } from '../types';
import toast from 'react-hot-toast';

export function useInvites(orgId: string | null) {
  return useQuery({
    queryKey: ['invites', orgId],
    queryFn: () => invitesApi.list(orgId!),
    enabled: !!orgId,
  });
}

export function useCreateInvite(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInvite) => invitesApi.create(orgId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invites', orgId] });
      toast.success('Invitation sent');
    },
    onError: () => { toast.error('Failed to send invitation'); },
  });
}
