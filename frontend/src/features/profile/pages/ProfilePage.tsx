import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { editUserSchema, type EditUserData, type UserResponse, Gender } from '../types/profile.types';
import { profileApi } from '../services/profileApi';
import { useAuthStore } from '../../../store/useAuthStore';
import { api } from '../../../config/axiosInstance'; // Tizimga kirgan user ma'lumotini olish uchun
import { Camera, Trash2, Plus, Globe, Briefcase, Loader2 } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const logoutStore = useAuthStore((state) => state.logout);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [newSkill, setNewSkill] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EditUserData>({
    resolver: zodResolver(editUserSchema),
  });

  // Sahifa yuklanganda joriy foydalanuvchi ma'lumotlarini backenddan olish
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Agar sizda /api/v1/profile/me kabi endpoint bo'lsa yoki tokendan decode qilib id olinsa:
        // Hozircha login qilgan userning ID-sini 1 deb tasavvur qilib API'dan tortamiz.
        // Agar backendda /me endpoint bo'lsa, o'shanga so'rov yuborgan ma'qul.
        const response = await api.get<UserResponse>(`/api/v1/profile/1/edit`); // Vaqtincha GET simulyatsiyasi yoki o'zingizning profile yuklash endpointingiz
        setUser(response.data);
        reset(response.data);
      } catch (err: any) {
        setErrorMsg("Foydalanuvchi ma'lumotlarini yuklashda xatolik yuz berdi.");
      } finally {
        setPageLoading(false);
      }
    };

    fetchUserProfile();
  }, [reset]);

  // 1. Profil ma'lumotlarini tahrirlash (Form submit)
  const onSubmit = async (data: EditUserData) => {
    if (!user) return;
    setBtnLoading(true);
    setSuccessMsg(null);
    setErrorMsg(null);
    try {
      // Backend listlarni tahrirlashda EditUserRequest ichida skills va socialLinkslarni ham qabul qiladi
      const updatedUser = await profileApi.editUser(user.id, data);
      setUser(updatedUser);
      setSuccessMsg("Profil muvaffaqiyatli yangilandi!");
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "Xatolik yuz berdi.");
    } finally {
      setBtnLoading(false);
    }
  };

  // 2. Avatar yuklash
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    try {
      await profileApi.uploadAvatar(user.id, file);
      // Profilni qayta yangilash (yoki rasm nomini backenddan olib yozish)
      setUser(prev => prev ? { ...prev, avatar: URL.createObjectURL(file) } : null);
      setSuccessMsg("Avatar yangilandi!");
    } catch (err: any) {
      setErrorMsg("Avatarni yuklashda xatolik.");
    }
  };

  // 3. Avatarni o'chirish
  const handleRemoveAvatar = async () => {
    if (!user) return;
    try {
      await profileApi.removeAvatar(user.id);
      setUser(prev => prev ? { ...prev, avatar: null } : null);
      setSuccessMsg("Avatar o'chirildi!");
    } catch (err: any) {
      setErrorMsg("Avatarni o'chirishda xatolik.");
    }
  };

  // 4. Skill o'chirish
  const handleRemoveSkill = async (skillName: string) => {
    if (!user) return;
    try {
      await profileApi.removeSkill(user.id, skillName);
      setUser(prev => prev ? { ...prev, skills: prev.skills.filter(s => s !== skillName) } : null);
    } catch (err: any) {
      setErrorMsg("Skillni o'chirishda xatolik yuz berdi.");
    }
  };

  // 5. Social Link o'chirish
  const handleRemoveSocial = async (link: string) => {
    if (!user) return;
    try {
      await profileApi.removeSocialLink(user.id, link);
      setUser(prev => prev ? { ...prev, socialLinks: prev.socialLinks.filter(s => s !== link) } : null);
    } catch (err: any) {
      setErrorMsg("Ijtimoiy tarmoqni o'chirishda xatolik.");
    }
  };

  // Yangi skill qo'shish (Edit endpointi orqali listni yangilash)
  const handleAddSkill = async () => {
    if (!user || !newSkill.trim()) return;
    if (user.skills.includes(newSkill.trim())) return;

    const updatedSkills = [...user.skills, newSkill.trim()];
    try {
      const updatedUser = await profileApi.editUser(user.id, { username: user.username, skills: updatedSkills });
      setUser(updatedUser);
      setNewSkill('');
    } catch (err: any) {
      setErrorMsg("Yangi skill qo'shishda xatolik.");
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (!user) return <div className="text-center py-10 text-red-500">Foydalanuvchi topilmadi.</div>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Yuqori Header Panel */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-col sm:flex-row text-center sm:text-left">
            <div className="relative group w-24 h-24">
              <img 
                src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'} 
                alt="Avatar" 
                className="w-full h-full rounded-2xl object-cover border-2 border-gray-100"
              />
              <label className="absolute inset-0 bg-black/40 rounded-2xl flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition duration-200">
                <Camera className="text-white" size={20} />
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
              </label>
              {user.avatar && (
                <button onClick={handleRemoveAvatar} className="absolute -top-2 -right-2 bg-red-100 p-1 rounded-lg text-red-600 hover:bg-red-200 transition">
                  <Trash2 size={14} />
                </button>
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{user.firstName || ''} {user.lastName || ''}</h1>
              <p className="text-sm text-gray-500">@{user.username} • {user.email}</p>
              <span className="mt-1 inline-block px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">{user.role}</span>
            </div>
          </div>
          <button onClick={() => logoutStore()} className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-medium transition">
            Tizimdan chiqish
          </button>
        </div>

        {successMsg && <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-sm text-center">{successMsg}</div>}
        {errorMsg && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm text-center">{errorMsg}</div>}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Chap ustun: Skills & Socials */}
          <div className="space-y-6">
            {/* Ko'nikmalar */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2"><Briefcase size={18}/> Ko'nikmalar</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills?.map(skill => (
                  <span key={skill} className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium rounded-lg transition">
                    {skill}
                    <button type="button" onClick={() => handleRemoveSkill(skill)} className="text-gray-400 hover:text-red-500 text-sm font-bold">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <input type="text" value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="Yangi skill..." className="w-full px-3 py-1.5 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                <button type="button" onClick={handleAddSkill} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg"><Plus size={16}/></button>
              </div>
            </div>

            {/* Ijtimoiy tarmoqlar */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2"><Globe size={18}/> Ijtimoiy Linklar</h3>
              <ul className="space-y-2">
                {user.socialLinks?.map(link => (
                  <li key={link} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <span className="truncate text-gray-600">{link}</span>
                    <button type="button" onClick={() => handleRemoveSocial(link)} className="text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* O'ng ustun: Tahrirlash formasi */}
          <div className="md:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold text-gray-900 mb-6">Ma'lumotlarni tahrirlash</h3>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600">Ism</label>
                  <input {...register('firstName')} type="text" className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">Familiya</label>
                  <input {...register('lastName')} type="text" className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600">Username</label>
                <input {...register('username')} type="text" className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" />
                {errors.username && <p className="text-xs text-red-500 mt-1">{errors.username.message}</p>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600">Telefon raqam</label>
                  <input {...register('phone')} type="text" className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">Mamlakat</label>
                  <input {...register('country')} type="text" className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-600">Jins (Gender)</label>
                  <select {...register('gender')} className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none">
                    <option value={Gender.MALE}>MALE</option>
                    <option value={Gender.FEMALE}>FEMALE</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600">Tug'ilgan sana</label>
                  <input {...register('birthDate')} type="date" className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600">Tarjimai hol (Bio)</label>
                <textarea {...register('bio')} rows={3} className="w-full mt-1 px-3 py-2 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 outline-none resize-none" placeholder="O'zingiz haqingizda..."></textarea>
                {errors.bio && <p className="text-xs text-red-500 mt-1">{errors.bio.message}</p>}
              </div>

              <div className="flex justify-end pt-2">
                <button type="submit" disabled={btnLoading} className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm disabled:opacity-50">
                  {btnLoading ? "Saqlanmoqda..." : "O'zgarishlarni saqlash"}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};