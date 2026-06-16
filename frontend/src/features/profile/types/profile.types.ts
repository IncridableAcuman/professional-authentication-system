import { z } from 'zod';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export interface UserResponse {
  id: number;
  firstName: string | null;
  lastName: string | null;
  username: string;
  email: string;
  role: UserRole;
  gender: Gender | null;
  phone: string | null;
  avatar: string | null;
  birthDate: string | null;
  bio: string | null;
  country: string | null;
  skills: string[];
  socialLinks: string[];
}

// Profil tahrirlash uchun Zod Validation
export const editUserSchema = z.object({
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  username: z.string().min(3, "Username kamida 3 ta belgi bo'lishi shart"),
  phone: z.string().nullable().optional(),
  birthDate: z.string().nullable().optional(),
  bio: z.string().max(500, "Bio 500 ta belgidan oshmasligi kerak").nullable().optional(),
  country: z.string().nullable().optional(),
  gender: z.nativeEnum(Gender).nullable().optional(),
  skills: z.array(z.string()).optional(),
  socialLinks: z.array(z.string()).optional(),
});

export type EditUserData = z.infer<typeof editUserSchema>;