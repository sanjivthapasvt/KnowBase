// src/features/document_versions/hooks/useDocumentVersions.ts
'use client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { documentVersionsApi } from '../api';
import toast from 'react-hot-toast';

export function useDocumentVersions(orgId: string, documentId: string) {
  return useQuery({
    queryKey: ['document-versions', orgId, documentId],
    queryFn: () => documentVersionsApi.list(orgId, documentId),
    enabled: !!orgId && !!documentId,
  });
}

export function useDocumentVersion(orgId: string, documentId: string, versionId: string) {
  return useQuery({
    queryKey: ['document-versions', orgId, documentId, versionId],
    queryFn: () => documentVersionsApi.get(orgId, documentId, versionId),
    enabled: !!orgId && !!documentId && !!versionId,
  });
}

export function useCreateDocumentVersion(orgId: string, documentId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { title: string; content: string }) => documentVersionsApi.create(orgId, documentId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document-versions', orgId, documentId] });
      toast.success('Version created');
    },
    onError: () => { toast.error('Failed to create version'); },
  });
}
