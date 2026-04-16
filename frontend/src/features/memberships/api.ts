// src/features/memberships/api.ts
import apiClient from '@/lib/api/client';
import type { CursorPage } from '@/types/api';
import type { Membership } from './types';

export const membershipsApi = {
  list: async (orgId: string, cursor?: string): Promise<CursorPage<Membership>> => {
    const res = await apiClient.get<CursorPage<Membership>>(`/organizations/${orgId}/members`, {
      params: cursor ? { cursor } : undefined,
    });
    return res.data;
  },
  remove: async (orgId: string, membershipId: string): Promise<void> => {
    await apiClient.delete(`/organizations/${orgId}/members/${membershipId}`);
  },
};
