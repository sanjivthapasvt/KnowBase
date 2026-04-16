// src/features/documents/hooks/useDocuments.ts
'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsApi } from '../api';
import type { CreateDocument } from '../types';
import toast from 'react-hot-toast';

export function useDocuments(orgId: string | null, workspaceId?: string | null) {
  return useQuery({
    queryKey: ['documents', orgId, workspaceId],
    queryFn: () => documentsApi.list(orgId!, workspaceId || undefined),
    enabled: !!orgId,
  });
}

export function useCreateDocument(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateDocument) => documentsApi.create(orgId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document created');
    },
    onError: () => { toast.error('Failed to create document'); },
  });
}

export function useDeleteDocument(orgId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (documentId: string) => documentsApi.delete(orgId, documentId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document deleted');
    },
    onError: () => { toast.error('Failed to delete document'); },
  });
}
