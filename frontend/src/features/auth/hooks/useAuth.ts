// src/features/auth/hooks/useAuth.ts
'use client';
import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { useWorkspaceStore } from '@/store/workspace.store';
import { authApi } from '../api';
import type { LoginRequest, RegisterRequest } from '../types';

export function useAuth() {
  const router = useRouter();
  const { setTokens, clearTokens, isAuthenticated } = useAuthStore();
  const clearWorkspace = useWorkspaceStore((s) => s.clear);

  const loginMutation = useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: (res) => {
      setTokens(res.access_token, res.refresh_token);
      router.push('/organizations');
    },
  });

  const registerMutation = useMutation({
    mutationFn: (data: RegisterRequest) => authApi.register(data),
    onSuccess: (res) => {
      setTokens(res.access_token, res.refresh_token);
      router.push('/organizations');
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      clearTokens();
      clearWorkspace();
      router.push('/login');
    },
  });

  return {
    login: loginMutation.mutate,
    register: registerMutation.mutate,
    logout: logoutMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error,
    registerError: registerMutation.error,
    isAuthenticated,
  };
}
