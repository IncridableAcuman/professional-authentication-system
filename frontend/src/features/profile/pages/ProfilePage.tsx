import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { editUserSchema, type EditUserData, type UserResponse, Gender } from '../types/profile.types';
import { profileApi } from '../services/profileApi';
import { useAuthStore } from '../../../store/useAuthStore';
import {
  Camera, Trash2, Plus, Globe, Briefcase, Loader2, CheckCircle2, AlertCircle,
  User, Phone, MapPin, Calendar, Sparkles, Send, ExternalLink, LogOut, X,
} from 'lucide-react';
import {FaGithub} from "react-icons/fa";
import {FaInstagram, FaLinkedin, FaTwitter} from "react-icons/fa6";

export const ProfilePage: React.FC = () => {
  const logoutStore = useAuthStore((state) => state.logout);
  const [user, setUser] = useState<UserResponse | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [btnLoading, setBtnLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [newSkill, setNewSkill] = useState('');
  const [newSocial, setNewSocial] = useState('');

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EditUserData>({
    resolver: zodResolver(editUserSchema),
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const data = await profileApi.getMe();
        setUser(data);
        reset({
          ...data,
          firstName: data.firstName || '',
          lastName: data.lastName || '',
          phone: data.phone || '',
          country: data.country || '',
          birthDate: data.birthDate || '',
          bio: data.bio || '',
          gender: data.gender || undefined,
        });
      } catch (err: any) {
        setErrorMsg("Foydalanuvchi ma'lumotlarini yuklashda xatolik yuz berdi.");
      } finally {
        setPageLoading(false);
      }
    };

    fetchUserProfile();
  }, [reset]);

  // Avatar URL-ni xavfsiz shakllantirish funksiyasi
  const getAvatarUrl = (avatarName: string | null) => {
    if (!avatarName) {
      return 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&h=300&q=80';
    }
    if (avatarName.startsWith('http') || avatarName.startsWith('blob:')) {
      return avatarName;
    }
    // Backend sozlamangizga qarab yo'lni tanlang (/uploads/ yoki /api/v1/files/)
    return `http://localhost:8080/uploads/${avatarName}`;
  };

  const onSubmit = async (data: EditUserData) => {
    if (!user) return;
    setBtnLoading(true);
    try {
      const updatedUser = await profileApi.editUser(data);
      setUser(updatedUser);
      setSuccessMsg("Profil ma'lumotlari muvaffaqiyatli saqlandi!");
    } catch (err: any) {
      setErrorMsg(err.response?.data?.message || "O'zgarishlarni saqlashda xatolik yuz berdi.");
    } finally {
      setBtnLoading(false);
    }
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!user || !e.target.files || !e.target.files[0]) return;
    const file = e.target.files[0];
    setAvatarLoading(true);
    setErrorMsg(null);
    try {
      const newAvatarUrl = await profileApi.uploadAvatar(file);
      setUser(prev => prev ? { ...prev, avatar: newAvatarUrl || URL.createObjectURL(file) } : null);
      setSuccessMsg("Avatar rasmi yangilandi!");
    } catch (err: any) {
      setErrorMsg("Avatarni yuklashda xatolik yuz berdi.");
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!user) return;
    setAvatarLoading(true);
    try {
      await profileApi.removeAvatar();
      setUser(prev => prev ? { ...prev, avatar: null } : null);
      setSuccessMsg("Avatar o'chirildi!");
    } catch (err: any) {
      setErrorMsg("Avatarni o'chirishda xatolik yuz berdi.");
    } finally {
      setAvatarLoading(false);
    }
  };

  const handleAddSkill = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newSkill.trim();
    if (!user || !trimmed) return;
    if (user.skills?.includes(trimmed)) {
      setErrorMsg("Ushbu ko'nikma allaqachon mavjud.");
      return;
    }

    const updatedSkills = [...(user.skills || []), trimmed];
    try {
      const updatedUser = await profileApi.editUser({ username: user.username, skills: updatedSkills });
      setUser(updatedUser);
      setNewSkill('');
      setSuccessMsg("Yangi ko'nikma qo'shildi.");
    } catch (err: any) {
      setErrorMsg("Ko'nikma qo'shishda xatolik.");
    }
  };

  const handleRemoveSkill = async (skillName: string) => {
    if (!user) return;
    try {
      await profileApi.removeSkill(skillName);
      setUser(prev => prev ? { ...prev, skills: prev.skills.filter(s => s !== skillName) } : null);
    } catch (err: any) {
      setErrorMsg("Ko'nikmani o'chirishda xatolik yuz berdi.");
    }
  };

  const handleAddSocial = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = newSocial.trim();
    if (!user || !trimmed) return;

    const updatedSocials = [...(user.socialLinks || []), trimmed];
    try {
      const updatedUser = await profileApi.editUser({ username: user.username, socialLinks: updatedSocials });
      setUser(updatedUser);
      setNewSocial('');
    } catch (err: any) {
      setErrorMsg("Havola qo'shishda xatolik.");
    }
  };

  const handleRemoveSocial = async (link: string) => {
    if (!user) return;
    try {
      await profileApi.removeSocialLink(link);
      setUser(prev => prev ? { ...prev, socialLinks: prev.socialLinks.filter(s => s !== link) } : null);
    } catch (err: any) {
      setErrorMsg("Ijtimoiy tarmoqni o'chirishda xatolik.");
    }
  };

  const getSocialIcon = (url: string) => {
    const lowercase = url.toLowerCase();
    if (lowercase.includes('github.com')) return <FaGithub size={16} className="text-gray-300" />;
    if (lowercase.includes('linkedin.com')) return <FaLinkedin size={16} className="text-blue-400" />;
    if (lowercase.includes('twitter.com') || lowercase.includes('x.com')) return <FaTwitter size={16} className="text-sky-400" />;
    if (lowercase.includes('instagram.com')) return <FaInstagram size={16} className="text-pink-400" />;
    if (lowercase.includes('t.me') || lowercase.includes('telegram')) return <Send size={16} className="text-blue-400" />;
    return <Globe size={16} className="text-emerald-400" />;
  };

  if (pageLoading) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950 text-white space-y-4">
          <Loader2 className="animate-spin text-indigo-500" size={48} />
          <p className="text-slate-400 text-sm tracking-wide">Profil ma'lumotlari yuklanmoqda...</p>
        </div>
    );
  }

  if (!user) return <div className="text-center py-20 text-rose-500 font-semibold">Foydalanuvchi topilmadi.</div>;

  return (
      <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-16 selection:bg-indigo-500 selection:text-white">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] pointer-events-none" />

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 relative z-10 space-y-8">

          {/* Header Banner */}
          <div className="relative rounded-3xl overflow-hidden border border-slate-800/80 bg-slate-900/60 backdrop-blur-xl shadow-2xl">
            <div className="h-44 sm:h-52 w-full bg-gradient-to-r from-indigo-900 via-purple-900 to-slate-900 relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(99,102,241,0.3),transparent_60%)]" />
              <div className="absolute right-6 top-6 flex items-center gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide backdrop-blur-md border ${
                  user.role === 'ADMIN'
                      ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                      : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
              }`}>
                {user.role}
              </span>
                <button
                    onClick={() => logoutStore()}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 text-xs font-medium transition duration-200"
                >
                  <LogOut size={14} /> Chiqish
                </button>
              </div>
            </div>

            <div className="px-6 sm:px-8 pb-8 pt-0 relative flex flex-col sm:flex-row items-center sm:items-end justify-between gap-6 -mt-16 sm:-mt-20">
              <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6 text-center sm:text-left">
                {/* Avatar */}
                <div className="relative group">
                  <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl p-1 bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 shadow-2xl">
                    <div className="w-full h-full rounded-[22px] overflow-hidden bg-slate-950 relative">
                      <img
                          src={getAvatarUrl(user.avatar)}
                          alt="Avatar"
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      {avatarLoading && (
                          <div className="absolute inset-0 bg-slate-950/80 flex items-center justify-center">
                            <Loader2 className="animate-spin text-indigo-400" size={24} />
                          </div>
                      )}
                    </div>
                  </div>

                  <label className="absolute bottom-2 right-2 p-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer shadow-lg hover:scale-110 active:scale-95 transition duration-200 border border-indigo-400/30">
                    <Camera size={16} />
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} disabled={avatarLoading} />
                  </label>

                  {user.avatar && (
                      <button
                          type="button"
                          onClick={handleRemoveAvatar}
                          className="absolute top-2 right-2 p-1.5 rounded-xl bg-slate-900/80 hover:bg-rose-600 text-slate-400 hover:text-white backdrop-blur-md transition duration-200 border border-slate-700/50"
                          title="Avatarni o'chirish"
                      >
                        <X size={14} />
                      </button>
                  )}
                </div>

                <div className="space-y-1 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center justify-center sm:justify-start gap-2">
                    {user.firstName || user.lastName ? `${user.firstName || ''} ${user.lastName || ''}` : user.username}
                    <Sparkles size={20} className="text-indigo-400" />
                  </h1>
                  <p className="text-sm text-slate-400 flex items-center justify-center sm:justify-start gap-2">
                    <span>@{user.username}</span>
                    <span>•</span>
                    <span>{user.email}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-xs text-slate-400 bg-slate-950/40 p-3 rounded-2xl border border-slate-800/60 backdrop-blur-md">
                <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/40 rounded-xl">
                  <Calendar size={14} className="text-indigo-400" />
                  <span>A'zo bo'lingan: {new Date(user.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notifications */}
          {successMsg && (
              <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm backdrop-blur-md animate-in fade-in">
                <div className="flex items-center gap-3">
                  <CheckCircle2 size={18} />
                  <span>{successMsg}</span>
                </div>
                <button onClick={() => setSuccessMsg(null)} className="hover:text-emerald-200"><X size={16}/></button>
              </div>
          )}

          {errorMsg && (
              <div className="flex items-center justify-between p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm backdrop-blur-md animate-in fade-in">
                <div className="flex items-center gap-3">
                  <AlertCircle size={18} />
                  <span>{errorMsg}</span>
                </div>
                <button onClick={() => setErrorMsg(null)} className="hover:text-rose-200"><X size={16}/></button>
              </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Chap ustun: Interactive Sidebar Widgets */}
            <div className="space-y-6">

              {/* Ko'nikmalar Card */}
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-200 flex items-center gap-2">
                    <Briefcase size={18} className="text-indigo-400" /> Ko'nikmalar
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">{user.skills?.length || 0} ta</span>
                </div>

                <div className="flex flex-wrap gap-2 min-h-[40px]">
                  {user.skills && user.skills.length > 0 ? (
                      user.skills.map((skill) => (
                          <span
                              key={skill}
                              className="inline-flex items-center gap-1.5 pl-3 pr-2 py-1 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 text-xs font-medium rounded-xl transition duration-150 group"
                          >
                      {skill}
                            <button
                                type="button"
                                onClick={() => handleRemoveSkill(skill)}
                                className="text-indigo-400/60 group-hover:text-rose-400 hover:bg-rose-500/20 p-0.5 rounded-md transition"
                            >
                        <X size={12} />
                      </button>
                    </span>
                      ))
                  ) : (
                      <p className="text-xs text-slate-500 italic">Hali ko'nikmalar qo'shilmadi</p>
                  )}
                </div>

                <form onSubmit={handleAddSkill} className="flex gap-2 pt-2 border-t border-slate-800/60">
                  <input
                      type="text"
                      value={newSkill}
                      onChange={e => setNewSkill(e.target.value)}
                      placeholder="Yangi ko'nikma (masalan: React)..."
                      className="w-full px-3.5 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                      type="submit"
                      className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl transition duration-150 shrink-0"
                      title="Qo'shish"
                  >
                    <Plus size={16} />
                  </button>
                </form>
              </div>

              {/* Ijtimoiy tarmoqlar Card */}
              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-200 flex items-center gap-2">
                    <Globe size={18} className="text-emerald-400" /> Ijtimoiy Havolalar
                  </h3>
                  <span className="text-xs text-slate-500 font-mono">{user.socialLinks?.length || 0} ta</span>
                </div>

                <div className="space-y-2">
                  {user.socialLinks && user.socialLinks.length > 0 ? (
                      user.socialLinks.map((link) => (
                          <div
                              key={link}
                              className="flex items-center justify-between gap-3 p-2.5 rounded-2xl bg-slate-950/40 border border-slate-800/60 hover:border-slate-700/80 transition duration-150 group"
                          >
                            <a
                                href={link.startsWith('http') ? link : `https://${link}`}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center gap-2.5 truncate text-xs text-slate-300 hover:text-indigo-400 transition"
                            >
                              <div className="p-1.5 rounded-lg bg-slate-800/60">
                                {getSocialIcon(link)}
                              </div>
                              <span className="truncate max-w-[180px]">{link}</span>
                              <ExternalLink size={12} className="opacity-0 group-hover:opacity-100 transition text-slate-500" />
                            </a>
                            <button
                                type="button"
                                onClick={() => handleRemoveSocial(link)}
                                className="text-slate-500 hover:text-rose-400 p-1.5 hover:bg-rose-500/10 rounded-lg transition"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                      ))
                  ) : (
                      <p className="text-xs text-slate-500 italic">Ijtimoiy tarmoqlar mavjud emas</p>
                  )}
                </div>

                <form onSubmit={handleAddSocial} className="flex gap-2 pt-2 border-t border-slate-800/60">
                  <input
                      type="text"
                      value={newSocial}
                      onChange={e => setNewSocial(e.target.value)}
                      placeholder="https://github.com/username"
                      className="w-full px-3.5 py-2 text-xs bg-slate-950/60 border border-slate-800 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                      type="submit"
                      className="p-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl transition duration-150 shrink-0"
                      title="Qo'shish"
                  >
                    <Plus size={16} />
                  </button>
                </form>
              </div>

            </div>

            {/* O'ng ustun: Tahrirlash Formasi */}
            <div className="lg:col-span-2 p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl shadow-xl">
              <div className="border-b border-slate-800/80 pb-4 mb-6">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <User size={20} className="text-indigo-400" /> Shaxsiy Ma'lumotlar
                </h3>
                <p className="text-xs text-slate-400 mt-1">Profilingiz ma'lumotlarini ushbu yerda yangilashingiz mumkin.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

                {/* Ism va Familiya */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Ism</label>
                    <input
                        {...register('firstName')}
                        type="text"
                        placeholder="Ismingizni kiriting"
                        className="w-full px-4 py-2.5 text-sm bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                    />
                    {errors.firstName && <p className="text-xs text-rose-400 mt-1">{errors.firstName.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Familiya</label>
                    <input
                        {...register('lastName')}
                        type="text"
                        placeholder="Familiyangizni kiriting"
                        className="w-full px-4 py-2.5 text-sm bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                    />
                    {errors.lastName && <p className="text-xs text-rose-400 mt-1">{errors.lastName.message}</p>}
                  </div>
                </div>

                {/* Username */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Username *</label>
                  <div className="relative">
                    <span className="absolute left-4 top-3 text-slate-500 text-sm">@</span>
                    <input
                        {...register('username')}
                        type="text"
                        className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-2xl text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                    />
                  </div>
                  {errors.username && <p className="text-xs text-rose-400 mt-1">{errors.username.message}</p>}
                </div>

                {/* Telefon & Mamlakat */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Phone size={14} className="text-slate-400" /> Telefon Raqam
                    </label>
                    <input
                        {...register('phone')}
                        type="text"
                        placeholder="+998 90 123 45 67"
                        className="w-full px-4 py-2.5 text-sm bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <MapPin size={14} className="text-slate-400" /> Mamlakat / Shahar
                    </label>
                    <input
                        {...register('country')}
                        type="text"
                        placeholder="O'zbekiston, Toshkent"
                        className="w-full px-4 py-2.5 text-sm bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                    />
                  </div>
                </div>

                {/* Gender & BirthDate */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5">Jins (Gender)</label>
                    <select
                        {...register('gender')}
                        className="w-full px-4 py-2.5 text-sm bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-2xl text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition"
                    >
                      <option value="" className="bg-slate-900 text-slate-400">Tanlanmagan</option>
                      <option value={Gender.MALE} className="bg-slate-900 text-slate-100">Erkak (Male)</option>
                      <option value={Gender.FEMALE} className="bg-slate-900 text-slate-100">Ayol (Female)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
                      <Calendar size={14} className="text-slate-400" /> Tug'ilgan Sana
                    </label>
                    <input
                        {...register('birthDate')}
                        type="date"
                        className="w-full px-4 py-2.5 text-sm bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-2xl text-slate-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Bio (Tarjimai hol)</label>
                  <textarea
                      {...register('bio')}
                      rows={4}
                      placeholder="O'zingiz haqingizda qisqacha yozing..."
                      className="w-full px-4 py-3 text-sm bg-slate-950/60 border border-slate-800 focus:border-indigo-500 rounded-2xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 transition resize-none"
                  />
                  {errors.bio && <p className="text-xs text-rose-400 mt-1">{errors.bio.message}</p>}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end pt-4 border-t border-slate-800/80">
                  <button
                      type="submit"
                      disabled={btnLoading}
                      className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-medium text-sm rounded-2xl shadow-lg shadow-indigo-500/20 active:scale-95 disabled:opacity-50 transition duration-200"
                  >
                    {btnLoading ? (
                        <>
                          <Loader2 className="animate-spin" size={16} /> Saqlanmoqda...
                        </>
                    ) : (
                        "O'zgarishlarni Saqlash"
                    )}
                  </button>
                </div>

              </form>
            </div>

          </div>

        </div>
      </div>
  );
};