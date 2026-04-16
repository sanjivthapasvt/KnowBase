// src/features/workspaces/hooks/useWorkspace.ts
'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { workspacesApi } from '../api';
import type { UpdateWorkspace } from '../types';
import toast from 'react-hot-toast';

export function useWorkspace(orgId: string, workspaceId: string) {
  return useQuery({
    queryKey: ['workspaces', orgId, workspaceId],
    queryFn: () => workspacesApi.get(orgId, workspaceId),
    enabled: !!orgId && !!workspaceId,
  });
}

export function useUpdateWorkspace(orgId: string, workspaceId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateWorkspace) => workspacesApi.update(orgId, workspaceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success('Workspace updated');
    },
    onError: () => { toast.error('Failed to update workspace'); },
  });
}

export function useDeleteWorkspace(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (workspaceId: string) => workspacesApi.delete(orgId, workspaceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['workspaces'] });
      toast.success('Workspace deleted');
    },
    onError: () => { toast.error('Failed to delete workspace'); },
  });
}
