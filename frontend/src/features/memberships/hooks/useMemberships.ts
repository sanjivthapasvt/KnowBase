// src/features/memberships/hooks/useMemberships.ts
'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { membershipsApi } from '../api';
import toast from 'react-hot-toast';

export function useMemberships(orgId: string | null) {
  return useQuery({
    queryKey: ['memberships', orgId],
    queryFn: () => membershipsApi.list(orgId!),
    enabled: !!orgId,
  });
}

export function useRemoveMember(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (membershipId: string) => membershipsApi.remove(orgId, membershipId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memberships', orgId] });
      toast.success('Member removed');
    },
    onError: () => { toast.error('Failed to remove member'); },
  });
}
