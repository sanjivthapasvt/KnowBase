// src/features/documents/hooks/useDocument.ts
'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentsApi } from '../api';
import type { UpdateDocument } from '../types';
import toast from 'react-hot-toast';

export function useDocument(orgId: string, documentId: string) {
  return useQuery({
    queryKey: ['documents', orgId, documentId],
    queryFn: () => documentsApi.get(orgId, documentId),
    enabled: !!orgId && !!documentId,
  });
}

export function useUpdateDocument(orgId: string, documentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: UpdateDocument) => documentsApi.update(orgId, documentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
      toast.success('Document updated');
    },
    onError: () => { toast.error('Failed to update document'); },
  });
}
