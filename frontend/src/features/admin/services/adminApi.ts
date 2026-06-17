import axiosInstance from '../../../config/axiosInstance';
import type { RoleRequest } from '../types/admin.types';

export const adminApi = {
  // Rolni tahrirlash (Query Param orqali id yuboriladi)
  editRole: async (id: number, request: RoleRequest) => {
    const response = await axiosInstance.patch<string>(`/admin/user?id=${id}`, request);
    return response.data;
  },

  // Foydalanuvchini tizimdan o'chirish
  removeUser: async (id: number) => {
    // Backend kodingizdagi @DeleteMapping mukammallashishi uchun /{id} shaklida yuboramiz
    const response = await axiosInstance.delete<string>(`/admin/user/${id}`);
    return response.data;
  }
};