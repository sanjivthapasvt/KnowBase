'use client';
import { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from '@/store/auth.store';
import apiClient from './api/client';

function AuthHydrator({ children }: { children: React.ReactNode }) {
  const hydrate = useAuthStore((s) => s.hydrate);
  const isHydrated = useAuthStore((s) => s.isHydrated);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const clearTokens = useAuthStore((s) => s.clearTokens);
  const [isRestoring, setIsRestoring] = useState(false);

  // hydrate
  useEffect(() => {
    hydrate();
  }, [hydrate]);

  // restore session
  useEffect(() => {
    if (!isHydrated || !refreshToken) return;
    setIsRestoring(true);

    apiClient
      .post("/auth/refresh", {
        refresh_token: refreshToken,
      })
      .catch(() => {
        clearTokens();
      })
      .finally(() => {
        setIsRestoring(false);
      });
  }, [isHydrated, refreshToken, clearTokens]);

  if (!isHydrated || isRestoring) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-accent border-t-transparent" />
      </div>
    );
  }

  return <>{children}</>;
}
export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
    },
  }));

  return (
    <QueryClientProvider client={queryClient}>
      <AuthHydrator>{children}</AuthHydrator>
      <Toaster position="top-right" toastOptions={{
        style: { background: '#1e293b', color: '#e2e8f0', border: '1px solid #334155', fontSize: '14px' },
        success: { iconTheme: { primary: '#22c55e', secondary: '#1e293b' } },
        error: { iconTheme: { primary: '#ef4444', secondary: '#1e293b' } },
      }} />
    </QueryClientProvider>
  );
}
