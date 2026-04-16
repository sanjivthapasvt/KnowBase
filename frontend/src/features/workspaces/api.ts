// src/features/workspaces/api.ts
import apiClient from '@/lib/api/client';
import type { CursorPage } from '@/types/api';
import type { Workspace, CreateWorkspace, UpdateWorkspace } from './types';

export const workspacesApi = {
  list: async (orgId: string, cursor?: string): Promise<CursorPage<Workspace>> => {
    const res = await apiClient.get<CursorPage<Workspace>>(`/organizations/${orgId}/workspaces`, {
      params: cursor ? { cursor } : undefined,
    });
    return res.data;
  },
  get: async (orgId: string, workspaceId: string): Promise<Workspace> => {
    const res = await apiClient.get<Workspace>(`/organizations/${orgId}/workspaces/${workspaceId}`);
    return res.data;
  },
  create: async (orgId: string, data: CreateWorkspace): Promise<Workspace> => {
    const res = await apiClient.post<Workspace>(`/organizations/${orgId}/workspaces`, data);
    return res.data;
  },
  update: async (orgId: string, workspaceId: string, data: UpdateWorkspace): Promise<Workspace> => {
    const res = await apiClient.patch<Workspace>(`/organizations/${orgId}/workspaces/${workspaceId}`, data);
    return res.data;
  },
  delete: async (orgId: string, workspaceId: string): Promise<void> => {
    await apiClient.delete(`/organizations/${orgId}/workspaces/${workspaceId}`);
  },
};
