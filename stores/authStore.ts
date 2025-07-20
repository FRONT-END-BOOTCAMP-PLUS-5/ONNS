import { create } from 'zustand';

interface AuthState {
  isJwtAuthenticated: boolean;
  hasUnreadNotification?: boolean;
  checkJwt: () => Promise<void>;
  setHasUnreadNotification: (value: boolean | undefined) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isJwtAuthenticated: false,
  hasUnreadNotification: undefined,
  checkJwt: async () => {
    try {
      const res = await fetch('/api/users/me', { credentials: 'include' });
      if (res.ok) {
        set((state) => {
          if (!state.isJwtAuthenticated) {
            return { isJwtAuthenticated: true };
          }
          return state;
        });
      } else if (res.status === 401) {
        set((state) => {
          if (state.isJwtAuthenticated) {
            return { isJwtAuthenticated: false };
          }
          return state;
        });
      }
    } catch {
      set((state) => {
        if (state.isJwtAuthenticated) {
          return { isJwtAuthenticated: false };
        }
        return state;
      });
    }
  },
  setHasUnreadNotification: (value) => set({ hasUnreadNotification: value }),
}));
