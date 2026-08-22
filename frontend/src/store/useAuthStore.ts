// store/useAuthStore.ts
import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  userRole: 'USER' | 'ADMIN' | null;
  setAuth: (token: string, role: 'USER' | 'ADMIN') => void;
  logout: () => void;
}

// Token bor-yo'qligini va rolni localStorage'dan o'qish
const initialToken = localStorage.getItem('accessToken');
const initialRole = localStorage.getItem('userRole') as 'USER' | 'ADMIN' | null;

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: initialToken,
  isAuthenticated: !!initialToken,
  userRole: initialRole,

  setAuth: (token, role) => {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('userRole', role);
    set({ accessToken: token, isAuthenticated: true, userRole: role });
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userRole');
    set({ accessToken: null, isAuthenticated: false, userRole: null });
  },
}));