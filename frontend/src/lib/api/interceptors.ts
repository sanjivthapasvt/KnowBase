// src/lib/api/interceptors.ts
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/store/auth.store';
import { useRouter } from 'next/navigation';

interface QueueItem {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

function processQueue(error: unknown, token: string | null = null): void {
  failedQueue.forEach((item) => {
    if (error) {
      item.reject(error);
    } else {
      item.resolve(token as string);
    }
  });
  failedQueue = [];
}

export function setupInterceptors(apiClient: AxiosInstance): void {
  const { isHydrated } = useAuthStore();

  if (!isHydrated) return;

  apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const accessToken = useAuthStore.getState().accessToken;
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error: AxiosError) => Promise.reject(error),
  );

  apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
      if (error.response?.status !== 401 || originalRequest._retry) {
        return Promise.reject(error);
      }
      const url = originalRequest.url ?? '';
      if (url.includes('/auth/login') || url.includes('/auth/register') || url.includes('/auth/refresh')) {
        return Promise.reject(error);
      }
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }
      originalRequest._retry = true;
      isRefreshing = true;
      try {
        const refreshToken = useAuthStore.getState().refreshToken;
        if (!refreshToken) throw new Error('No refresh token available');
        const response = await apiClient.post<{ access_token: string; refresh_token: string }>(
          '/auth/refresh', { refresh_token: refreshToken },
        );
        const { access_token, refresh_token } = response.data;
        useAuthStore.getState().setTokens(access_token, refresh_token ?? refreshToken);
        processQueue(null, access_token);
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        useAuthStore.getState().clearTokens();
        if (typeof window !== 'undefined') {
          const router = useRouter();
          router.push('/login');
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    },
  );
}
