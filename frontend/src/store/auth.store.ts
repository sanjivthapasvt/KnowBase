import { create } from 'zustand';

const REFRESH_TOKEN_KEY = 'kb_refresh_token';

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  setTokens: (accessToken: string, refreshToken: string) => void;
  clearTokens: () => void;
  hydrate: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isHydrated: false,

  setTokens: (accessToken: string, refreshToken: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      document.cookie = 'kb_session=1; path=/; SameSite=Lax';
    }
    set({ accessToken, refreshToken, isAuthenticated: true });
  },

  clearTokens: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(REFRESH_TOKEN_KEY);
      document.cookie =
        'kb_session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
    }
    set({
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
    });
  },

  hydrate: () => {
    if (typeof window !== 'undefined') {
      const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
      set({
        refreshToken,
        isHydrated: true,
      });
    }
  },
}));
