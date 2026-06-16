import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { authApi } from '../services/authApi';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      authApi.verifyEmail(token)
        .then(() => setStatus('success'))
        .catch(() => setStatus('error'));
    } else {
      setStatus('error');
    }
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-100">
        {status === 'loading' && (
          <div className="flex flex-col items-center space-y-4">
            <Loader2 className="animate-spin text-blue-500" size={48} />
            <h2 className="text-xl font-semibold text-gray-700">Emailingiz tasdiqlanmoqda...</h2>
          </div>
        )}

        {status === 'success' && (
          <div className="flex flex-col items-center space-y-4">
            <CheckCircle className="text-green-500" size={56} />
            <h2 className="text-2xl font-bold text-gray-900">Muvaffaqiyatli tasdiqlandi!</h2>
            <p className="text-gray-500">Endi hisobingizga kirib tizimdan to'liq foydalanishingiz mumkin.</p>
            <Link to="/login" className="mt-2 inline-flex justify-center py-2 px-6 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition shadow-sm">
              Kirish sahifasiga o'tish
            </Link>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center space-y-4">
            <XCircle className="text-red-500" size={56} />
            <h2 className="text-2xl font-bold text-gray-900">Xatolik yuz berdi</h2>
            <p className="text-gray-500">Token eskirgan yoki noto'g'ri berilgan. Iltimos, qaytadan urinib ko'ring.</p>
            <Link to="/register" className="mt-2 text-sm font-medium text-blue-600 hover:text-blue-500">
              Qayta ro'yxatdan o'tish
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};