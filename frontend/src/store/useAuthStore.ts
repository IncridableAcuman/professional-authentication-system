import { create } from 'zustand';

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  userRole: 'USER' | 'ADMIN' | null;
  setAuth: (token: string, role: 'USER' | 'ADMIN') => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: localStorage.getItem('accessToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  userRole: null, // Buni dastlabki yuklanishda tokenni decode qilib olish ham mumkin
  setAuth: (token, role) => {
    localStorage.setItem('accessToken', token);
    set({ accessToken: token, isAuthenticated: true, userRole: role });
  },
  logout: () => {
    localStorage.removeItem('accessToken');
    set({ accessToken: null, isAuthenticated: false, userRole: null });
  },
}));