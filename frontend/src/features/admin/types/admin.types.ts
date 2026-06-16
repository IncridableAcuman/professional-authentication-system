import { UserRole } from '../../profile/types/profile.types';

// Backend @RequestBody RoleRequest DTO'siga mos tushadi
export interface RoleRequest {
  role: UserRole;
}

// Jadvalda ko'rsatish uchun foydalanuvchining asosiy ma'lumotlari
export interface AdminUserListItem {
  id: number;
  firstName: string | null;
  lastName: string | null;
  username: string;
  email: string;
  role: UserRole;
  enabled: boolean;
}