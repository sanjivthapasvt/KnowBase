// src/features/organizations/api.ts
import apiClient from '@/lib/api/client';
import type { CursorPage } from '@/types/api';
import type { Organization, CreateOrganization, UpdateOrganization } from './types';

export const organizationsApi = {
  list: async (cursor?: string): Promise<CursorPage<Organization>> => {
    const res = await apiClient.get<CursorPage<Organization>>('/organizations', {
      params: cursor ? { cursor } : undefined,
    });
    return res.data;
  },
  get: async (orgId: string): Promise<Organization> => {
    const res = await apiClient.get<Organization>(`/organizations/${orgId}`);
    return res.data;
  },
  create: async (data: CreateOrganization): Promise<Organization> => {
    const res = await apiClient.post<Organization>('/organizations', data);
    return res.data;
  },
  update: async (orgId: string, data: UpdateOrganization): Promise<Organization> => {
    const res = await apiClient.patch<Organization>(`/organizations/${orgId}`, data);
    return res.data;
  },
};
