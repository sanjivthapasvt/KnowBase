// src/features/document_versions/api.ts
import apiClient from '@/lib/api/client';
import type { CursorPage } from '@/types/api';
import type { DocumentVersion } from './types';

export const documentVersionsApi = {
  list: async (orgId: string, documentId: string, cursor?: string): Promise<CursorPage<DocumentVersion>> => {
    const res = await apiClient.get<CursorPage<DocumentVersion>>(
      `/organizations/${orgId}/documents/${documentId}/versions`,
      { params: cursor ? { cursor } : undefined },
    );
    return res.data;
  },
  get: async (orgId: string, documentId: string, versionId: string): Promise<DocumentVersion> => {
    const res = await apiClient.get<DocumentVersion>(
      `/organizations/${orgId}/documents/${documentId}/versions/${versionId}`,
    );
    return res.data;
  },
  create: async (orgId: string, documentId: string, data: { title: string; content: string }): Promise<DocumentVersion> => {
    const res = await apiClient.post<DocumentVersion>(
      `/organizations/${orgId}/documents/${documentId}/versions`,
      data,
    );
    return res.data;
  },
};
