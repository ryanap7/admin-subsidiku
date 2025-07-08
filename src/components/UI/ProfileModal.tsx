import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, MapPin, Calendar, Save } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Modal from './Modal';
import Button from './Button';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+62 812-3456-7890',
    address: 'Jl. Malioboro No. 123, Yogyakarta',
    joinDate: '15 Januari 2023'
  });

  const handleSave = () => {
    // Simulate save operation
    setIsEditing(false);
    alert('Profil berhasil diperbarui!');
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? "Edit Profil" : "Profil Pengguna"}
      size="md"
    >
      <div className="space-y-6">
        {/* Profile Header */}
        <div className="text-center">
          <div className="relative inline-block">
            <img
              src={user?.avatar || 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'}
              alt="User Avatar"
              className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
            />
            {isEditing && (
              <button className="absolute bottom-4 right-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                <User className="w-3 h-3" />
              </button>
            )}
          </div>
          {!isEditing ? (
            <>
              <h3 className="text-xl font-semibold text-gray-800">{user?.name}</h3>
              <p className="text-gray-600">{user?.role === 'admin' ? 'Administrator' : user?.role}</p>
            </>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="text-center text-xl font-semibold bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none"
              />
              <p className="text-gray-600">{user?.role === 'admin' ? 'Administrator' : user?.role}</p>
            </div>
          )}
        </div>

        {/* Profile Information */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
            <Mail className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-sm text-gray-600">Email</p>
              {!isEditing ? (
                <p className="font-medium">{formData.email}</p>
              ) : (
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none"
                />
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
            <Phone className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-sm text-gray-600">Nomor Telepon</p>
              {!isEditing ? (
                <p className="font-medium">{formData.phone}</p>
              ) : (
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none"
                />
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
            <MapPin className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-sm text-gray-600">Alamat</p>
              {!isEditing ? (
                <p className="font-medium">{formData.address}</p>
              ) : (
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full bg-transparent border-b border-gray-300 focus:border-blue-500 outline-none"
                />
              )}
            </div>
          </div>

          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
            <Calendar className="w-5 h-5 text-gray-400" />
            <div className="flex-1">
              <p className="text-sm text-gray-600">Bergabung Sejak</p>
              <p className="font-medium">{formData.joinDate}</p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-xl">
            <p className="text-2xl font-bold text-blue-600">156</p>
            <p className="text-xs text-blue-700">Transaksi Diproses</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-xl">
            <p className="text-2xl font-bold text-green-600">23</p>
            <p className="text-xs text-green-700">Hari Aktif</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button variant="secondary" onClick={onClose}>
            Tutup
          </Button>
          {!isEditing ? (
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              <User className="w-4 h-4 mr-2" />
              Edit Profil
            </Button>
          ) : (
            <Button variant="primary" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Simpan
            </Button>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ProfileModal;