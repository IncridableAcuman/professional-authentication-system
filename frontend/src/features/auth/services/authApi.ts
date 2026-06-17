import axiosInstance from '../../../config/axiosInstance';
import type { AuthResponse, ForgotPasswordData, LoginData, RegisterData, ResetPasswordData } from '../../../types/auth.types';

export const authApi = {
  register: async (data: Omit<RegisterData, 'confirmPassword'>) => {
    const response = await axiosInstance.post<string>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginData) => {
    const response = await axiosInstance.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post<string>('/auth/logout');
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordData) => {
    const response = await axiosInstance.post<string>('/auth/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data: Omit<ResetPasswordData, 'confirmPassword'>) => {
    const response = await axiosInstance.patch<string>('/auth/reset-password', data);
    return response.data;
  },

  verifyEmail: async (token: string) => {
    const response = await axiosInstance.get<string>(`/auth/verify-email?token=${token}`);
    return response.data;
  }
};