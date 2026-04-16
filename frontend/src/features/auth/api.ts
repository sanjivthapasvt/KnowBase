// src/features/auth/api.ts
import apiClient from '@/lib/api/client';
import type { AuthResponse, LoginRequest, RegisterRequest } from './types';

export const authApi = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/login', data);
    return res.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/register', data);
    return res.data;
  },

  refresh: async (refreshToken: string): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return res.data;
  },

  logout: async (): Promise<void> => {
    // Backend has no logout endpoint — client-side token clear only
  },
};
