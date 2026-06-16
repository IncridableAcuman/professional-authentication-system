import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { editUserSchema, type EditUserData, type UserResponse, Gender, UserRole } from '../types/profile.types';
import { profileApi } from '../services/profileApi';
import { useAuthStore } from '../../../store/useAuthStore';
import { Camera, Trash2, Plus, Globe, Briefcase } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const logoutStore = useAuthStore((state) => state.logout);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Mock foydalanuvchi ma'lumoti (Amalda login jarayonida yoki alohida /me endpointidan olinadi)
  const [user, setUser] = useState<UserResponse>({
    id: 1,
    firstName: "Izzatbek",
    lastName: "Abdusharipov",
    username: "incridable_acuman",
    email: "izzatbek@example.com",
    role: "USER" as UserRole,
    gender: Gender.MALE,
    phone: "+998901234567",
    avatar: null,
    birthDate: "2000-01-01",
    bio: "Java Backend & React Developer",
    country: "Uzbekistan",
    skills: ["Java", "Spring Boot", "PostgreSQL", "React", "TypeScript"],
    socialLinks: ["github.com/IncridableAcuman", "linkedin.com/in/izzatbek"]
  });

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EditUserData>({
    resolver: zodResolver(editUserSchema),
    defaultValues: user
  });

  // Dynamic yangi skill va social qo'shish uchun vaqtinchalik local statelar
  const [newSkill, setNewSkill] = useState('');
  const [newSocial, setNewSocial] = useState('');

  // 1. Umumiy formalarni saqlash
  const onSubmit = async (data: EditUserData) => {
    setLoading(true);
    setSuccessMsg(null);
    try {
      const updatedUser = await profileApi.editUser(user.id, data);
      setUser(updatedUser);
      setSuccessMsg("Profil muvaffaqiyatli yangilandi!");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // Mock rejimda ishlashi uchun local stateni ham yangilab qo'yamiz
      setUser((prev) => ({ ...prev, ...data } as UserResponse));
      setSuccessMsg("Profil saqlandi (Local update)!");
    } finally {
      setLoading(false);
    }
  };

  // 2. Avatar Fayl yuklash hodisasi
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      try {
        await profileApi.uploadAvatar(user.id, file);
        // UI render qilish uchun vaqtinchalik URL yaratamiz
        setUser(prev => ({ ...prev, avatar: URL.createObjectURL(file) }));
      } catch (err) {
        setUser(prev => ({ ...prev, avatar: URL.createObjectURL(file) }));
      }
    }
  };

  // 3. Avatarni o'chirish
  const handleRemoveAvatar = async () => {
    try {
      await profileApi.removeAvatar(user.id);
      setUser(prev => ({ ...prev, avatar: null }));
    } catch (err) {
      setUser(prev => ({ ...prev, avatar: null }));
    }
  };

  // 4. Skill o'chirish
  const handleRemoveSkill = async (skillName: string) => {
    try {
      await profileApi.removeSkill(user.id, skillName);
      setUser(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillName) }));
    } catch (err) {
      setUser(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skillName) }));
    }
  };

  // 5. Social Link o'chirish
  const handleRemoveSocial = async (link: string) => {
    try {
      await profileApi.removeSocialLink(user.id, link);
      setUser(prev => ({ ...prev, socialLinks: prev.socialLinks.filter(s => s !== link) }));
    } catch (err) {
      setUser(prev => ({ ...prev, socialLinks: prev.socialLinks.filter(s => s !== link) }));
    }
  };

  // Yangi skill qo'shish (Form submit bo'lganda birga ketadi yoki editUser orqali yuboriladi)
  const addSkillLocal = () => {
    if (newSkill.trim() && !user.skills.includes(newSkill.trim())) {
      const updatedSkills = [...user.skills, newSkill.trim()];
      setUser(prev => ({ ...prev, skills: updatedSkills }));
      profileApi.editUser(user.id, { ...user, skills: updatedSkills });
      setNewSkill('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Yuqori Header Panel */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 flex-col sm:flex-row text-center sm:text-left">
            {/* Avatar qismi */}
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
              <h1 className="text-2xl font-bold text-gray-900">{user.firstName} {user.lastName}</h1>
              <p className="text-sm text-gray-500">@{user.username} • {user.email}</p>
              <span className="mt-1 inline-block px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-md text-xs font-medium">{user.role}</span>
            </div>
          </div>
          <button onClick={() => logoutStore()} className="px-4 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg text-sm font-medium transition">
            Tizimdan chiqish
          </button>
        </div>

        {successMsg && (
          <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-sm text-center">
            {successMsg}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Chap ustun: Skills & Socials */}
          <div className="space-y-6">
            {/* Ko'nikmalar (Skills) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2"><Briefcase size={18}/> Ko'nikmalar</h3>
              <div className="flex flex-wrap gap-2">
                {user.skills.map(skill => (
                  <span key={skill} className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-medium rounded-lg transition">
                    {skill}
                    <button onClick={() => handleRemoveSkill(skill)} className="text-gray-400 hover:text-red-500 rounded p-0.5">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2 mt-2">
                <input type="text" value={newSkill} onChange={e => setNewSkill(e.target.value)} placeholder="Yangi skill..." className="w-full px-3 py-1.5 text-sm border rounded-lg outline-none focus:ring-2 focus:ring-blue-500" />
                <button onClick={addSkillLocal} className="p-2 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg"><Plus size={16}/></button>
              </div>
            </div>

            {/* Ijtimoiy tarmoqlar (Socials) */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
              <h3 className="font-bold text-gray-900 flex items-center gap-2"><Globe size={18}/> Ijtimoiy Linklar</h3>
              <ul className="space-y-2">
                {user.socialLinks.map(link => (
                  <li key={link} className="flex items-center justify-between text-sm bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <span className="truncate text-gray-600">{link}</span>
                    <button onClick={() => handleRemoveSocial(link)} className="text-gray-400 hover:text-red-500"><Trash2 size={14}/></button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* O'ng ustun: Umumiy ma'lumotlarni tahrirlash formasi */}
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
                    <option value={Gender.MALE}>Erkak</option>
                    <option value={Gender.FEMALE}>Ayol</option>
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
                <button type="submit" disabled={loading} className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition shadow-sm disabled:opacity-50">
                  {loading ? "Saqlanmoqda..." : "O'zgarishlarni saqlash"}
                </button>
              </div>
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};