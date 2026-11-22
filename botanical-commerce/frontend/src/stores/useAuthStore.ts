import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { IUser } from '../types';
import { fetchApi } from '../lib/api';

interface AuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (token: string, user: IUser) => void;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: true,

      login: (token: string, user: IUser) => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('aranya_access_token', token);
        }
        set({ token, user, isAuthenticated: true, isLoading: false });
      },

      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('aranya_access_token');
        }
        set({ token: null, user: null, isAuthenticated: false, isLoading: false });
      },

      checkAuth: async () => {
        const token = typeof window !== 'undefined' ? localStorage.getItem('aranya_access_token') : null;
        if (!token) {
          set({ user: null, token: null, isAuthenticated: false, isLoading: false });
          return;
        }

        try {
          const res = await fetchApi('/auth/profile', {
            headers: { Authorization: `Bearer ${token}` },
          });
          set({ user: res.data, token, isAuthenticated: true, isLoading: false });
        } catch {
          if (typeof window !== 'undefined') {
            localStorage.removeItem('aranya_access_token');
          }
          set({ user: null, token: null, isAuthenticated: false, isLoading: false });
        }
      },
    }),
    {
      name: 'aranya_auth_state',
      partialize: (state) => ({ token: state.token, user: state.user, isAuthenticated: state.isAuthenticated }),
    }
  )
);
