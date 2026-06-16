import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { authApi } from '../services/authApi';
import { Mail, ArrowLeft, Send } from 'lucide-react';
import { forgotPasswordSchema, type ForgotPasswordData } from '../../../types/auth.types';

export const ForgotPasswordPage: React.FC = () => {
  const [isSent, setIsSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<ForgotPasswordData>({
    resolver: zodResolver(forgotPasswordSchema)
  });

  const onSubmit = async (data: ForgotPasswordData) => {
    setLoading(true);
    setError(null);
    try {
      await authApi.forgotPassword(data);
      setIsSent(true);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      setError(err.response?.data?.message || "Ushbu email topilmadi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg border border-gray-100 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Parolni tiklash</h2>
          <p className="text-sm text-gray-500 mt-1">Profilingiz pochtasini kiritsangiz, tiklash havolasini yuboramiz</p>
        </div>

        {isSent ? (
          <div className="bg-green-50 text-green-700 p-4 rounded-lg text-sm text-center border border-green-200">
            Parolni tiklash havolasi pochtangizga muvaffaqiyatli yuborildi!
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm text-center border border-red-200">{error}</div>}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email manzili</label>
              <div className="mt-1 relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400"><Mail size={18} /></span>
                <input {...register('email')} type="email" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50" placeholder="example@mail.com" />
              </div>
              {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
            </div>

            <button type="submit" disabled={loading} className="w-full flex items-center justify-center gap-2 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50">
              <Send size={16} /> {loading ? "Yuborilmoqda..." : "Havolani yuborish"}
            </button>
          </form>
        )}

        <div className="text-center">
          <Link to="/login" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-700">
            <ArrowLeft size={16} /> Loginga qaytish
          </Link>
        </div>
      </div>
    </div>
  );
};