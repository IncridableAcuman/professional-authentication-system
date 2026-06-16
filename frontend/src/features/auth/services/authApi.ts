import { api } from '../../../config/axiosInstance';
import type { AuthResponse, ForgotPasswordData, LoginData, RegisterData, ResetPasswordData } from '../../../types/auth.types';

export const authApi = {
  register: async (data: Omit<RegisterData, 'confirmPassword'>) => {
    const response = await api.post<string>('/api/v1/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData) => {
    // Backend HttpServletResponse ichiga cookie joylaydi va AuthResponse qaytaradi
    const response = await api.post<AuthResponse>('/api/v1/auth/login', data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post<string>('/api/v1/auth/logout');
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordData) => {
    const response = await api.post<string>('/api/v1/auth/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data: Omit<ResetPasswordData, 'confirmPassword'>) => {
    const response = await api.patch<string>('/api/v1/auth/reset-password', data);
    return response.data;
  },

  verifyEmail: async (token: string) => {
    const response = await api.get<string>(`/api/v1/auth/verify-email?token=${token}`);
    return response.data;
  }
};