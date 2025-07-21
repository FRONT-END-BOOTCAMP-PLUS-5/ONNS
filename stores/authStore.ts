import { create } from 'zustand';
import api from '@/utils/axiosInstance';
import { AxiosError } from 'axios';

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
      const res = await api.get('/users/me', { withCredentials: true });
      if (res.status === 200) {
        set((state) => {
          if (!state.isJwtAuthenticated) {
            return { isJwtAuthenticated: true };
          }
          return state;
        });
      } else if (res.status === 401) {
        // 401이면 refresh 시도
        try {
          const refreshRes = await api.post('/auth/refresh', {}, { withCredentials: true });
          if (refreshRes.status === 200) {
            // 재발급 성공 시 다시 확인
            const retryRes = await api.get('/users/me', { withCredentials: true });
            if (retryRes.status === 200) {
              set({ isJwtAuthenticated: true });
              return;
            }
          }
        } catch {
          // refresh 실패
        }
        set({ isJwtAuthenticated: false });
      }
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response && err.response.status === 401) {
        // 401이면 refresh 시도
        try {
          const refreshRes = await api.post('/auth/refresh', {}, { withCredentials: true });
          if (refreshRes.status === 200) {
            // 재발급 성공 시 다시 확인
            const retryRes = await api.get('/users/me', { withCredentials: true });
            if (retryRes.status === 200) {
              set({ isJwtAuthenticated: true });
              return;
            }
          }
        } catch {
          // refresh 실패
        }
      }
      set({ isJwtAuthenticated: false });
    }
  },
  setHasUnreadNotification: (value) => set({ hasUnreadNotification: value }),
}));
