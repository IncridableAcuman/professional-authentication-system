import { z } from 'zod';

// --- ZOD VALIDATION SCHEMAS ---

export const loginSchema = z.object({
  email: z.string().email("Noto'g'ri email shakli"),
  password: z.string().min(6, "Parol kamida 6 ta belgidan iborat bo'lishi kerak")
});

export const registerSchema = z.object({
  username: z.string().min(3, "Username kamida 3 ta belgi bo'lishi kerak"),
  email: z.string().email("Noto'g'ri email shakli"),
  password: z.string().min(6, "Parol kamida 6 ta belgi bo'lishi kerak"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Parollar bir-biriga mos kelmadi",
  path: ["confirmPassword"]
});

export const forgotPasswordSchema = z.object({
  email: z.string().email("Noto'g'ri email shakli")
});

export const resetPasswordSchema = z.object({
  password: z.string().min(6, "Yangi parol kamida 6 ta belgi bo'lishi kerak"),
  confirmPassword: z.string(),
  token: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Parollar bir-biriga mos kelmadi",
  path: ["confirmPassword"]
});

// --- TYPES INFERRED FROM SCHEMAS ---
export type LoginData = z.infer<typeof loginSchema>;
export type RegisterData = z.infer<typeof registerSchema>;
export type ForgotPasswordData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordData = z.infer<typeof resetPasswordSchema>;

export interface AuthResponse {
  accessToken: string;
}
export interface AuthResponse {
  accessToken: string;
  role: 'USER' | 'ADMIN'; // Backenddan rol ham qaytishi lozim
}