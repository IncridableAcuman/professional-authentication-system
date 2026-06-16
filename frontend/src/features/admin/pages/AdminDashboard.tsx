import React, { useState } from 'react';
import { adminApi } from '../services/adminApi';
import type { AdminUserListItem } from '../types/admin.types';
import { UserRole } from '../../profile/types/profile.types';
import { Shield, Trash2, Edit2, UserCheck, UserX, Search, X } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<AdminUserListItem | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRole, setNewRole] = useState<UserRole>(UserRole.USER);
  const [notification, setNotification] = useState<string | null>(null);

  // Mock Foydalanuvchilar Ro'yxati (Amalda backenddan hamma userlar olib kelinadi)
  const [users, setUsers] = useState<AdminUserListItem[]>([
    { id: 1, firstName: "Izzatbek", lastName: "Abdusharipov", username: "incridable_acuman", email: "izzatbek@example.com", role: UserRole.ADMIN, enabled: true },
    { id: 2, firstName: "Ali", lastName: "Valiyev", username: "ali_valiyev", email: "ali@example.com", role: UserRole.USER, enabled: true },
    { id: 3, firstName: "Olim", lastName: "Hasanov", username: "olim99", email: "olim@example.com", role: UserRole.USER, enabled: false },
  ]);

  // 1. Rolni o'zgartirish oynasini ochish
  const openRoleModal = (user: AdminUserListItem) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setIsModalOpen(true);
  };

  // 2. Rolni saqlash (Backendga PATCH so'rov)
  const handleSaveRole = async () => {
    if (!selectedUser) return;
    try {
      await adminApi.editRole(selectedUser.id, { role: newRole });
      
      setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, role: newRole } : u));
      setNotification(`@${selectedUser.username} roli muvaffaqiyatli o'zgartirildi!`);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      // Mock rejimda ishlashi uchun local yangilaymiz
      setUsers(prev => prev.map(u => u.id === selectedUser.id ? { ...u, role: newRole } : u));
      setNotification(`Rol saqlandi (Local update)!`);
    } finally {
      setIsModalOpen(false);
      setSelectedUser(null);
    }
  };

  // 3. Userni o'chirish (Backendga DELETE so'rov)
  const handleRemoveUser = async (user: AdminUserListItem) => {
    if (window.confirm(`Haqiqatdan ham @${user.username} foydalanuvchisini o'chirmoqchisiz?`)) {
      try {
        await adminApi.removeUser(user.id);
        setUsers(prev => prev.filter(u => u.id !== user.id));
        setNotification("Foydalanuvchi tizimdan muvaffaqiyatli o'chirildi!");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (err) {
        setUsers(prev => prev.filter(u => u.id !== user.id));
        setNotification("Foydalanuvchi o'chirildi (Local update)!");
      }
    }
  };

  // Qidiruv bo'yicha filterlash
  const filteredUsers = users.filter(u => 
    u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Sarlavha qismi */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Shield className="text-blue-600" size={26} /> Admin Boshqaruv Paneli
            </h1>
            <p className="text-sm text-gray-500 mt-1">Tizimdagi foydalanuvchilar ro'yxati va rollarni boshqarish</p>
          </div>
          
          {/* Qidiruv Inputi */}
          <div className="relative w-full sm:w-64">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
              <Search size={16} />
            </span>
            <input 
              type="text" 
              placeholder="Username yoki email..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>
        </div>

        {notification && (
          <div className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-xl text-sm flex justify-between items-center">
            <span>{notification}</span>
            <button onClick={() => setNotification(null)} className="text-blue-400 hover:text-blue-600">×</button>
          </div>
        )}

        {/* Foydalanuvchilar Jadvali (Table) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-100">
                  <th className="px-6 py-4">Foydalanuvchi</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Holati</th>
                  <th className="px-6 py-4">Roli</th>
                  <th className="px-6 py-4 text-right">Amallar</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50/50 transition">
                    <td className="px-6 py-4 font-medium text-gray-900">
                      <div>{user.firstName} {user.lastName}</div>
                      <div className="text-xs text-gray-400">@{user.username}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-500">{user.email}</td>
                    <td className="px-6 py-4">
                      {user.enabled ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-green-50 text-green-700 rounded-md text-xs font-medium">
                          <UserCheck size={12} /> Faol
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-amber-50 text-amber-700 rounded-md text-xs font-medium">
                          <UserX size={12} /> Tasdiqlanmagan
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-md text-xs font-medium ${user.role === UserRole.ADMIN ? 'bg-purple-50 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => openRoleModal(user)} 
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg inline-flex items-center transition"
                        title="Rolni o'zgartirish"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleRemoveUser(user)} 
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg inline-flex items-center transition"
                        title="O'chirish"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-gray-400">Foydalanuvchilar topilmadi.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Rol O'zgartirish Modali (Modal Popup) */}
        {isModalOpen && selectedUser && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white w-full max-w-md rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="flex justify-between items-center p-6 border-b border-gray-100">
                <h3 className="font-bold text-gray-900 text-lg">Rolni Tahrirlash</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-700">@{selectedUser.username}</span> foydalanuvchisi uchun yangi tizim rolini tanlang:
                </p>
                
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-600 uppercase">Tizim Roli</label>
                  <select 
                    value={newRole} 
                    onChange={(e) => setNewRole(e.target.value as UserRole)}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl bg-gray-50 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value={UserRole.USER}>USER (Oddiy foydalanuvchi)</option>
                    <option value={UserRole.ADMIN}>ADMIN (Tizim boshqaruvchisi)</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2 p-6 bg-gray-50 border-t border-gray-100">
                <button 
                  onClick={() => setIsModalOpen(false)} 
                  className="px-4 py-2 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition"
                >
                  Bekor qilish
                </button>
                <button 
                  onClick={handleSaveRole} 
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-xl hover:bg-blue-700 shadow-sm transition"
                >
                  Saqlash
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};