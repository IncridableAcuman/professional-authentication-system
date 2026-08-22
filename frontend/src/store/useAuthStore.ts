import { create } from 'zustand';

export type UserRole = 'USER' | 'ADMIN';

// JWT ichidagi ma'lumotlar tipi (Spring Boot JwtUtil generatsiyasiga qarab)
interface JwtPayload {
  sub?: string;
  role?: UserRole;
  roles?: string[] | UserRole; // Agar Spring Security claims'da "roles" deb yuborsa
  exp?: number;
  [key: string]: any;
}

// JWT Tokenni dekod qilish yordamchi funksiyasi
const parseJwt = (token: string): JwtPayload | null => {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

// Token muddati o'tmaganini va undan rolni ajratish
const extractRoleAndValidate = (token: string | null): { role: UserRole | null; isValid: boolean } => {
  if (!token) return { role: null, isValid: false };
  
  const decoded = parseJwt(token);
  if (!decoded) return { role: null, isValid: false };

  // Token muddati (exp) o'tganligini tekshirish
  if (decoded.exp && decoded.exp * 1000 < Date.now()) {
    return { role: null, isValid: false };
  }

  // Rolni aniqlash (Spring Boot da claim nomi "role" yoki "roles" bo'lishi mumkin)
  let role: UserRole | null = null;
  if (typeof decoded.role === 'string') {
    role = decoded.role as UserRole;
  } else if (Array.isArray(decoded.roles)) {
    role = decoded.roles[0] as UserRole;
  } else if (typeof decoded.roles === 'string') {
    role = decoded.roles as UserRole;
  }

  return { role, isValid: true };
};

interface AuthState {
  accessToken: string | null;
  isAuthenticated: boolean;
  userRole: UserRole | null;
  setAuth: (token: string) => void;
  logout: () => void;
}

// Dastur yuklanganda localStorage'dagi tokenni avtomatik dekod qilish
const savedToken = localStorage.getItem('accessToken');
const { role: initialRole, isValid: isInitialTokenValid } = extractRoleAndValidate(savedToken);

// Agar token muddati o'tgan bo'lsa, localStorage'ni tozalaymiz
if (savedToken && !isInitialTokenValid) {
  localStorage.removeItem('accessToken');
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: isInitialTokenValid ? savedToken : null,
  isAuthenticated: isInitialTokenValid,
  userRole: isInitialTokenValid ? initialRole : null,

  // Endi setAuth faqat `token` qabul qiladi, `role` avtomatik ajratib olinadi
  setAuth: (token: string) => {
    const { role, isValid } = extractRoleAndValidate(token);

    if (isValid && role) {
      localStorage.setItem('accessToken', token);
      set({
        accessToken: token,
        isAuthenticated: true,
        userRole: role,
      });
    } else {
      // Token yaroqsiz bo'lsa avtomatik logout qiladi
      localStorage.removeItem('accessToken');
      set({
        accessToken: null,
        isAuthenticated: false,
        userRole: null,
      });
    }
  },

  logout: () => {
    localStorage.removeItem('accessToken');
    set({
      accessToken: null,
      isAuthenticated: false,
      userRole: null,
    });
  },
}));