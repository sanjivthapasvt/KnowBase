// src/features/documents/api.ts
import apiClient from '@/lib/api/client';
import type { CursorPage } from '@/types/api';
import type { Document, CreateDocument, UpdateDocument } from './types';

export const documentsApi = {
  list: async (orgId: string, workspaceId?: string, cursor?: string): Promise<CursorPage<Document>> => {
    const params: Record<string, string> = {};
    if (workspaceId) params.workspace_id = workspaceId;
    if (cursor) params.cursor = cursor;
    const res = await apiClient.get<CursorPage<Document>>(`/organizations/${orgId}/documents`, { params });
    return res.data;
  },
  get: async (orgId: string, documentId: string): Promise<Document> => {
    const res = await apiClient.get<Document>(`/organizations/${orgId}/documents/${documentId}`);
    return res.data;
  },
  create: async (orgId: string, data: CreateDocument): Promise<Document> => {
    const res = await apiClient.post<Document>(`/organizations/${orgId}/documents`, data);
    return res.data;
  },
  update: async (orgId: string, documentId: string, data: UpdateDocument): Promise<Document> => {
    const res = await apiClient.patch<Document>(`/organizations/${orgId}/documents/${documentId}`, data);
    return res.data;
  },
  delete: async (orgId: string, documentId: string): Promise<void> => {
    await apiClient.delete(`/organizations/${orgId}/documents/${documentId}`);
  },
};
