// src/features/users/api.ts
import apiClient from '@/lib/api/client';
import type { User, UserUpdate } from './types';

export const usersApi = {
  getMe: async (): Promise<User> => {
    const res = await apiClient.get<User>('/users/me');
    return res.data;
  },
  updateMe: async (data: UserUpdate): Promise<User> => {
    const res = await apiClient.patch<User>('/users/me', data);
    return res.data;
  },
};
