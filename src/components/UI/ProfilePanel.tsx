import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Save, Edit3, Shield, Activity, Settings, LogOut, Camera, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from './Button';

interface ProfilePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfilePanel: React.FC<ProfilePanelProps> = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+62 812-3456-7890',
    address: 'Jl. Malioboro No. 123, Yogyakarta',
    joinDate: '15 Januari 2023',
    department: 'Divisi Subsidi Pertanian',
    employeeId: 'EMP001',
    lastLogin: '15 Januari 2024, 14:30'
  });

  const tabs = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'activity', label: 'Aktivitas', icon: Activity },
    { id: 'settings', label: 'Pengaturan', icon: Settings }
  ];

  const recentActivities = [
    { action: 'Login ke sistem', time: '2 menit yang lalu', type: 'login' },
    { action: 'Memproses transaksi TXN001', time: '15 menit yang lalu', type: 'transaction' },
    { action: 'Menambah penerima subsidi baru', time: '1 jam yang lalu', type: 'recipient' },
    { action: 'Mengubah kuota penerima', time: '2 jam yang lalu', type: 'quota' },
    { action: 'Export laporan bulanan', time: '3 jam yang lalu', type: 'report' }
  ];

  const handleSave = () => {
    setIsEditing(false);
    alert('Profil berhasil diperbarui!');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'login': return Shield;
      case 'transaction': return Activity;
      case 'recipient': return User;
      case 'quota': return Settings;
      case 'report': return Mail;
      default: return Activity;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'login': return 'bg-green-100 text-green-600';
      case 'transaction': return 'bg-blue-100 text-blue-600';
      case 'recipient': return 'bg-purple-100 text-purple-600';
      case 'quota': return 'bg-yellow-100 text-yellow-600';
      case 'report': return 'bg-orange-100 text-orange-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
      />
      
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed right-0 top-0 h-full w-full max-w-2xl bg-white shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Profil Pengguna</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Profile Header */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img
                src={user?.avatar || 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'}
                alt="User Avatar"
                className="w-20 h-20 rounded-full object-cover border-4 border-white/30"
              />
              {isEditing && (
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-white rounded-full flex items-center justify-center text-gray-600 shadow-lg">
                  <Camera className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{user?.name}</h3>
              <p className="text-green-100">{user?.role === 'admin' ? 'Administrator' : user?.role}</p>
              <p className="text-green-100 text-sm">{formData.department}</p>
            </div>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
              className="bg-white/20 border-white/30 text-white hover:bg-white/30"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              {isEditing ? 'Batal' : 'Edit'}
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 bg-gray-50">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'text-blue-600 border-b-2 border-blue-600 bg-white'
                    : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Personal Information */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Informasi Pribadi</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nama Lengkap</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="font-medium">{formData.name}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="font-medium">{formData.email}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nomor Telepon</label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      ) : (
                        <p className="font-medium">{formData.phone}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Alamat</label>
                      {isEditing ? (
                        <textarea
                          value={formData.address}
                          onChange={(e) => handleInputChange('address', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows={3}
                        />
                      ) : (
                        <p className="font-medium">{formData.address}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">ID Karyawan</label>
                      <p className="font-medium">{formData.employeeId}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Bergabung Sejak</label>
                      <p className="font-medium">{formData.joinDate}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Statistics */}
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Statistik Aktivitas</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-xl">
                    <p className="text-2xl font-bold text-blue-600">156</p>
                    <p className="text-sm text-blue-700">Transaksi Diproses</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-xl">
                    <p className="text-2xl font-bold text-green-600">23</p>
                    <p className="text-sm text-green-700">Hari Aktif</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-xl">
                    <p className="text-2xl font-bold text-purple-600">45</p>
                    <p className="text-sm text-purple-700">Penerima Ditambah</p>
                  </div>
                  <div className="text-center p-4 bg-orange-50 rounded-xl">
                    <p className="text-2xl font-bold text-orange-600">12</p>
                    <p className="text-sm text-orange-700">Laporan Dibuat</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Aktivitas Terbaru</h4>
                <div className="space-y-3">
                  {recentActivities.map((activity, index) => {
                    const Icon = getActivityIcon(activity.type);
                    return (
                      <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${getActivityColor(activity.type)}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-800">{activity.action}</p>
                          <p className="text-sm text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Login Terakhir</h4>
                <div className="p-4 bg-green-50 rounded-xl">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="font-medium text-green-800">Login Berhasil</p>
                      <p className="text-sm text-green-600">{formData.lastLogin}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="space-y-6">
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Preferensi Akun</h4>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div>
                      <h5 className="font-medium text-gray-800">Notifikasi Email</h5>
                      <p className="text-sm text-gray-600">Terima notifikasi melalui email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div>
                      <h5 className="font-medium text-gray-800">Notifikasi Push</h5>
                      <p className="text-sm text-gray-600">Terima notifikasi push di browser</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-xl">
                    <div>
                      <h5 className="font-medium text-gray-800">Mode Gelap</h5>
                      <p className="text-sm text-gray-600">Gunakan tema gelap untuk interface</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Keamanan</h4>
                <div className="space-y-3">
                  <Button variant="secondary" className="w-full justify-start">
                    <Shield className="w-4 h-4 mr-2" />
                    Ubah Password
                  </Button>
                  <Button variant="secondary" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Autentikasi Dua Faktor
                  </Button>
                  <Button variant="secondary" className="w-full justify-start">
                    <Activity className="w-4 h-4 mr-2" />
                    Riwayat Login
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            {isEditing ? (
              <div className="flex space-x-3">
                <Button variant="secondary" onClick={() => setIsEditing(false)}>
                  Batal
                </Button>
                <Button variant="primary" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Perubahan
                </Button>
              </div>
            ) : (
              <div></div>
            )}
            <Button variant="danger" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Keluar
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ProfilePanel;