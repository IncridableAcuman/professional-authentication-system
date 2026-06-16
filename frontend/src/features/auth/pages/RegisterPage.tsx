import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { authApi } from '../services/authApi';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { registerSchema, type RegisterData } from '../../../types/auth.types';

export const RegisterPage: React.FC = () => {
  const [showPass, setShowPass] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<RegisterData>({
    resolver: zodResolver(registerSchema)
  });

  const onSubmit = async (data: RegisterData) => {
    setLoading(true);
    setApiError(null);
    try {
      // confirmPassword ni olib tashlab faqat backend kutayotgan RegisterRequest ni yuboramiz
      const { confirmPassword, ...requestData } = data;
      await authApi.register(requestData);
      setIsSuccess(true);
    } catch (error: any) {
      setApiError(error.response?.data?.message || "Bu email allaqachon ro'yxatdan o'tgan!");
    } finally {
      setLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-100 space-y-4">
          <div className="flex justify-center text-green-500">
            <CheckCircle size={64} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Ro'yxatdan o'tdingiz!</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Profilingizni faollashtirish uchun elektron pochtangizga tasdiqlash havolasini yubordik. Iltimos, pochtangizni tekshiring.
          </p>
          <Link to="/login" className="mt-4 inline-block w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition shadow-sm">
            Kirish sahifasiga o'tish
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">Hisob yaratish</h2>
          <p className="text-sm text-gray-500 mt-1">Ma'lumotlaringizni kiriting va boshlang</p>
        </div>

        {apiError && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-200">
            {apiError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Foydalanuvchi nomi (Username)</label>
            <div className="mt-1 relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><User size={18} /></span>
              <input {...register('username')} type="text" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50" placeholder="izzatbek" />
            </div>
            {errors.username && <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email manzili</label>
            <div className="mt-1 relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><Mail size={18} /></span>
              <input {...register('email')} type="email" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50" placeholder="example@mail.com" />
            </div>
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Parol</label>
            <div className="mt-1 relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><Lock size={18} /></span>
              <input {...register('password')} type={showPass ? 'text' : 'password'} className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600">
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Parolni tasdiqlang</label>
            <div className="mt-1 relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><Lock size={18} /></span>
              <input {...register('confirmPassword')} type={showPass ? 'text' : 'password'} className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50" placeholder="••••••••" />
            </div>
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>}
          </div>

          <button type="submit" disabled={loading} className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 shadow-sm">
            {loading ? "Ro'yxatdan o'tilmoqda..." : "Ro'yxatdan o'tish"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-600">
          Akkauntingiz bormi?{' '}
          <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">Tizimga kiring</Link>
        </p>
      </div>
    </div>
  );
};