import { api } from '../../../config/axiosInstance';
import type { RoleRequest } from '../types/admin.types';

export const adminApi = {
  // Rolni tahrirlash (Query Param orqali id yuboriladi)
  editRole: async (id: number, request: RoleRequest) => {
    const response = await api.patch<string>(`/api/v1/admin/user?id=${id}`, request);
    return response.data;
  },

  // Foydalanuvchini tizimdan o'chirish
  removeUser: async (id: number) => {
    // Backend kodingizdagi @DeleteMapping mukammallashishi uchun /{id} shaklida yuboramiz
    const response = await api.delete<string>(`/api/v1/admin/user/${id}`);
    return response.data;
  }
};