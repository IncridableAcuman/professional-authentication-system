import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authApi } from '../services/authApi';
import { Lock, CheckCircle2 } from 'lucide-react';
import { resetPasswordSchema, type ResetPasswordData } from '../../../types/auth.types';

export const ResetPasswordPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';
  
  const [isChanged, setIsChanged] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<ResetPasswordData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token }
  });

  const onSubmit = async (data: ResetPasswordData) => {
    if (!token) {
      setApiError("Xavfsizlik tokeni eskirgan yoki noto'g'ri.");
      return;
    }
    setLoading(true);
    setApiError(null);
    try {
      const { confirmPassword, ...requestData } = data;
      await authApi.resetPassword(requestData);
      setIsChanged(true);
      setTimeout(() => navigate('/login'), 3000); // 3 soniyadan keyin loginga otadi
    } catch (err: any) {
      setApiError(err.response?.data?.message || "Token muddati tugagan!");
    } finally {
      setLoading(false);
    }
  };

  if (isChanged) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-100 space-y-4">
          <div className="flex justify-center text-green-500"><CheckCircle2 size={56} /></div>
          <h2 className="text-2xl font-bold text-gray-900">Parol yangilandi!</h2>
          <p className="text-sm text-gray-500">Yangi parol muvaffaqiyatli saqlandi. Bir necha soniyadan so'ng login sahifasiga o'tasiz...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Yangi parol o'rnatish</h2>
          <p className="text-sm text-gray-500 mt-1">Kuchli va esda qoladigan parol kiriting</p>
        </div>

        {apiError && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-200">{apiError}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...register('token')} />

          {/* New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Yangi parol</label>
            <div className="mt-1 relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><Lock size={18} /></span>
              <input { ...register('password') } type="password" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50" placeholder="••••••••" />
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Yangi parolni tasdiqlang</label>
            <div className="mt-1 relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><Lock size={18} /></span>
              <input { ...register('confirmPassword') } type="password" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50" placeholder="••••••••" />
            </div>
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-600">{errors.confirmPassword.message}</p>}
          </div>

          <button type="submit" disabled={loading} className="w-full py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
            {loading ? "Saqlanmoqda..." : "Parolni saqlash"}
          </button>
        </form>
      </div>
    </div>
  );
};