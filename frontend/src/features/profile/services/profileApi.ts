import axiosInstance from '../../../config/axiosInstance';
import type { UserResponse, EditUserData } from '../types/profile.types';

export const profileApi = {
  editUser: async (id: number, data: EditUserData) => {
    const response = await axiosInstance.patch<UserResponse>(`/profile/${id}/edit`, data);
    return response.data;
  },

  uploadAvatar: async (id: number, file: File) => {
    const formData = new FormData();
    formData.append('avatar', file); // Backend: @ModelAttribute MultipartFile avatar
    const response = await axiosInstance.patch<string>(`/profile/${id}/avatar`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  removeAvatar: async (id: number) => {
    const response = await axiosInstance.post<string>(`/profile/${id}/avatar/remove`);
    return response.data;
  },

  removeSkill: async (id: number, skillName: string) => {
    const response = await axiosInstance.delete<string>(`/profile/${id}/skills/${skillName}`);
    return response.data;
  },

  removeSocialLink: async (id: number, social: string) => {
    const response = await axiosInstance.delete<string>(`/profile/${id}/socials/${social}`);
    return response.data;
  },
  getMe: async ()=>{
    const response = await  axiosInstance.get<UserResponse>("/profile/me");
    return response.data;
  }
};