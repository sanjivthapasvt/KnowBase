// src/features/invites/api.ts
import apiClient from '@/lib/api/client';
import type { CursorPage } from '@/types/api';
import type { Invite, CreateInvite } from './types';

export const invitesApi = {
  list: async (orgId: string, cursor?: string): Promise<CursorPage<Invite>> => {
    const res = await apiClient.get<CursorPage<Invite>>(`/organizations/${orgId}/invites`, {
      params: cursor ? { cursor } : undefined,
    });
    return res.data;
  },
  create: async (orgId: string, data: CreateInvite): Promise<Invite> => {
    const res = await apiClient.post<Invite>(`/organizations/${orgId}/invites`, data);
    return res.data;
  },
  accept: async (token: string): Promise<void> => {
    await apiClient.post('/invites/accept', { token });
  },
  revoke: async (orgId: string, inviteId: string): Promise<void> => {
    await apiClient.delete(`/organizations/${orgId}/invites/${inviteId}`);
  },
};
