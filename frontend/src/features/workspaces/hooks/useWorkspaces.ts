// src/features/workspaces/hooks/useWorkspaces.ts
'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workspacesApi } from '../api';
import type { CreateWorkspace } from '../types';
import toast from 'react-hot-toast';

export function useWorkspaces(orgId: string | null) {
  return useQuery({
    queryKey: ['workspaces', orgId],
    queryFn: () => workspacesApi.list(orgId!),
    enabled: !!orgId,
  });
}

export function useCreateWorkspace(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateWorkspace) => workspacesApi.create(orgId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces', orgId] });
      toast.success('Workspace created');
    },
    onError: () => { toast.error('Failed to create workspace'); },
  });
}
