import axiosInstance from '../../../config/axiosInstance';
import type { UserResponse, EditUserData } from '../types/profile.types';

export const profileApi = {
  getMe: async () => {
    const response = await axiosInstance.get<UserResponse>('/profile/me');
    return response.data;
  },

  editUser: async (data: EditUserData) => {
    const response = await axiosInstance.patch<UserResponse>('/profile/edit', data);
    return response.data;
  },

  uploadAvatar: async (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);

    const response = await axiosInstance.patch<string>('/profile/avatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  removeAvatar: async () => {
    const response = await axiosInstance.delete<string>('/profile/avatar');
    return response.data;
  },

  removeSkill: async (skillName: string) => {
    const response = await axiosInstance.delete<string>(`/profile/skills/${encodeURIComponent(skillName)}`);
    return response.data;
  },

  removeSocialLink: async (social: string) => {
    const response = await axiosInstance.delete<string>(`/profile/socials/${encodeURIComponent(social)}`);
    return response.data;
  },
};