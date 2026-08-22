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
  enabled: boolean;
  avatar: string | null;
  birthDate: string | null;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
  country: string | null;
  skills: string[];
  socialLinks: string[];
}

// Bo'sh string "" kelganda uni null ga aylantiruvchi yordamchi qoida
const emptyToNull = z.literal('').transform(() => null);

export const editUserSchema = z.object({
  firstName: z.string().min(3, "Ism kamida 3 ta belgi bo'lishi kerak").max(50).or(emptyToNull).nullable().optional(),
  lastName: z.string().min(3, "Familiya kamida 3 ta belgi bo'lishi kerak").max(50).or(emptyToNull).nullable().optional(),
  username: z.string().min(3, "Username kamida 3 ta belgi bo'lishi kerak").max(50),
  gender: z.nativeEnum(Gender).or(emptyToNull).nullable().optional(),
  birthDate: z.string().or(emptyToNull).nullable().optional(),
  phone: z.string().or(emptyToNull).nullable().optional(),
  bio: z.string().max(500, "Bio 500 ta belgidan oshmasligi kerak").or(emptyToNull).nullable().optional(),
  country: z.string().or(emptyToNull).nullable().optional(),
  skills: z.array(z.string()).optional(),
  socialLinks: z.array(z.string()).optional(),
});

export type EditUserData = z.infer<typeof editUserSchema>;