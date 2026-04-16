// src/features/organizations/hooks/useOrganizations.ts
'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/auth.store';
import { organizationsApi } from '../api';
import type { CreateOrganization } from '../types';
import toast from 'react-hot-toast';

export function useOrganizations() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  return useQuery({
    queryKey: ['organizations'],
    queryFn: () => organizationsApi.list(),
    enabled: isAuthenticated,
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateOrganization) => organizationsApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['organizations'] });
      toast.success('Organization created');
    },
    onError: () => { toast.error('Failed to create organization'); },
  });
}
