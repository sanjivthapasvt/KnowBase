// src/features/organizations/hooks/useOrganization.ts
'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { organizationsApi } from '../api';
import type { UpdateOrganization } from '../types';
import toast from 'react-hot-toast';

export function useOrganization(orgId: string) {
  return useQuery({
    queryKey: ['organizations', orgId],
    queryFn: () => organizationsApi.get(orgId),
    enabled: !!orgId,
  });
}

export function useUpdateOrganization(orgId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateOrganization) => organizationsApi.update(orgId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      queryClient.invalidateQueries({ queryKey: ['organizations', orgId] });
      toast.success('Organization updated');
    },
    onError: () => { toast.error('Failed to update organization'); },
  });
}
