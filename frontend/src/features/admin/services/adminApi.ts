import axiosInstance from '../../../config/axiosInstance';
import type { AdminUserListItem, RoleRequest } from '../types/admin.types';

export const adminApi = {
  // Barcha foydalanuvchilarni yuklash
  getAllUsers: async (): Promise<AdminUserListItem[]> => {
    const response = await axiosInstance.get<AdminUserListItem[]>('/admin/user');
    return response.data;
  },

  // Rolni tahrirlash (Query Param orqali id yuboriladi)
  editRole: async (id: number, request: RoleRequest) => {
    const response = await axiosInstance.patch<string>(`/admin/user?id=${id}`, request);
    return response.data;
  },

  // Foydalanuvchini tizimdan o'chirish
  removeUser: async (id: number) => {
    const response = await axiosInstance.delete<string>(`/admin/user/${id}`);
    return response.data;
  }
};