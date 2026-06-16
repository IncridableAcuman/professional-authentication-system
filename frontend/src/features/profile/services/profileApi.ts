import { api } from '../../../config/axiosInstance';
import type { UserResponse, EditUserData } from '../types/profile.types';

export const profileApi = {
  // Profil ma'lumotlarini ID orqali tahrirlash -> PATCH /api/v1/profile/{id}/edit
  editUser: async (id: number, data: EditUserData) => {
    const response = await api.patch<UserResponse>(`/api/v1/profile/${id}/edit`, data);
    return response.data;
  },

  // Avatarni yuklash -> PATCH /api/v1/profile/{id}/avatar
  uploadAvatar: async (id: number, file: File) => {
    const formData = new FormData();
    formData.append('avatar', file); // Backend: @ModelAttribute MultipartFile avatar
    const response = await api.patch<string>(`/api/v1/profile/${id}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Avatarni o'chirish -> POST /api/v1/profile/{id}/avatar/remove
  removeAvatar: async (id: number) => {
    const response = await api.post<string>(`/api/v1/profile/${id}/avatar/remove`);
    return response.data;
  },

  // Skill o'chirish -> DELETE /api/v1/profile/{id}/skills/{skillName}
  removeSkill: async (id: number, skillName: string) => {
    const response = await api.delete<string>(`/api/v1/profile/${id}/skills/${skillName}`);
    return response.data;
  },

  // Social link o'chirish -> DELETE /api/v1/profile/{id}/socials/{social}
  removeSocialLink: async (id: number, social: string) => {
    const response = await api.delete<string>(`/api/v1/profile/${id}/socials/${social}`);
    return response.data;
  }
};