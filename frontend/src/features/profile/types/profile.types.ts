import { z } from 'zod';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

// Backenddagi UserResponse record bilan 1:1 mos
export interface UserResponse {
  id: number;
  firstName: string | null;
  lastName: string | null;
  username: string;
  email: string;
  role: UserRole;
  gender: Gender | null;
  phone: string | null;
  enabled: boolean;
  avatar: string | null;
  birthDate: string | null; // Date oson boshqarilishi uchun string (YYYY-MM-DD)
  bio: string | null;
  createdAt: string;
  updatedAt: string;
  country: string | null;
  skills: string[];
  socialLinks: string[];
}

export const editUserSchema = z.object({
  firstName: z.string().min(3, "Ism kamida 3 ta belgi bo'lishi kerak").max(50).nullable().optional(),
  lastName: z.string().min(3, "Familiya kamida 3 ta belgi bo'lishi kerak").max(50).nullable().optional(),
  username: z.string().min(3, "Username kamida 3 ta belgi bo'lishi kerak").max(50),
  gender: z.nativeEnum(Gender).nullable().optional(),
  birthDate: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  bio: z.string().max(500, "Bio 500 ta belgidan oshmasligi kerak").nullable().optional(),
  country: z.string().nullable().optional(),
  skills: z.array(z.string()).optional(),
  socialLinks: z.array(z.string()).optional(),
});

export type EditUserData = z.infer<typeof editUserSchema>;