import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi';
import { useAuthStore } from '../../../store/useAuthStore';
import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { loginSchema, type LoginData } from '../../../types/auth.types';

export const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginData>({
    resolver: zodResolver(loginSchema)
  });

const onSubmit = async (data: LoginData) => {
  setLoading(true);
  setApiError(null);
  try {
    const res = await authApi.login(data);
    
    // Backenddan kelgan haqiqiy rolni uzatamiz
    setAuth(res.accessToken, res.role); 
    
    if (res.role === 'ADMIN') {
      navigate('/admin/dashboard');
    } else {
      navigate('/profile');
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    setApiError(error.response?.data?.message || "Email tasdiqlanmagan yoki parol xato!");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        <div className="text-center">
          <h2 className="mt-2 text-3xl font-bold text-gray-900">Xush kelibsiz!</h2>
          <p className="mt-2 text-sm text-gray-500">Tizimga kirish uchun ma'lumotlarni kiriting</p>
        </div>

        {apiError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-200">
            {apiError}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email manzili</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={18} />
                </div>
                <input
                  {...register('email')}
                  type="email"
                  className={`block w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-lg focus:outline-none focus:ring-2 bg-gray-50`}
                  placeholder="example@mail.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Parol</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={18} />
                </div>
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  className={`block w-full pl-10 pr-10 py-2 border ${errors.password ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'} rounded-lg focus:outline-none focus:ring-2 bg-gray-50`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
            </div>
          </div>

          <div className="flex items-center justify-end">
            <Link to="/forgot-password" className="text-sm font-medium text-blue-600 hover:text-blue-500">
              Parolni unutdingizmi?
            </Link>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition duration-150"
            >
              {loading ? "Kirilmoqda..." : "Tizimga kirish"}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-gray-600">
          Akkauntingiz yo'qmi?{' '}
          <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
            Ro'yxatdan o'ting
          </Link>
        </p>
      </div>
    </div>
  );
};