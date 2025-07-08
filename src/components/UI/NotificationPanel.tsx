import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bell, AlertTriangle, CheckCircle, MessageSquare, X, Filter, Search, MoreVertical } from 'lucide-react';
import Button from './Button';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({ isOpen, onClose }) => {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const notifications = [
    {
      id: '1',
      type: 'warning',
      title: 'Stok Rendah - Kios Makmur Jaya',
      message: 'Stok pupuk tersisa 15 kg, segera lakukan pengisian ulang untuk memenuhi kebutuhan penerima subsidi.',
      time: '5 menit yang lalu',
      read: false,
      priority: 'high',
      category: 'inventory'
    },
    {
      id: '2',
      type: 'info',
      title: 'Transaksi Baru Menunggu Persetujuan',
      message: 'Transaksi TXN005 dari Budi Santoso untuk 25kg pupuk menunggu persetujuan Anda.',
      time: '10 menit yang lalu',
      read: false,
      priority: 'medium',
      category: 'transaction'
    },
    {
      id: '3',
      type: 'success',
      title: 'Kuota Bulanan Berhasil Direset',
      message: 'Kuota bulanan untuk semua penerima subsidi telah berhasil direset untuk periode Februari 2024.',
      time: '1 jam yang lalu',
      read: true,
      priority: 'low',
      category: 'system'
    },
    {
      id: '4',
      type: 'warning',
      title: 'Pengaduan Baru Perlu Ditindaklanjuti',
      message: 'Pengaduan CMP004 dari Siti Aminah tentang kualitas pupuk yang buruk perlu segera ditangani.',
      time: '2 jam yang lalu',
      read: true,
      priority: 'high',
      category: 'complaint'
    },
    {
      id: '5',
      type: 'info',
      title: 'Laporan Mingguan Tersedia',
      message: 'Laporan aktivitas mingguan periode 8-14 Januari 2024 telah tersedia untuk diunduh.',
      time: '3 jam yang lalu',
      read: true,
      priority: 'low',
      category: 'report'
    },
    {
      id: '6',
      type: 'warning',
      title: 'Agen Tidak Aktif - Toko Berkah',
      message: 'Agen Toko Berkah di Sleman tidak melaporkan aktivitas selama 3 hari terakhir.',
      time: '5 jam yang lalu',
      read: false,
      priority: 'medium',
      category: 'agent'
    }
  ];

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'warning': return AlertTriangle;
      case 'success': return CheckCircle;
      case 'info': return MessageSquare;
      default: return Bell;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'success': return 'text-green-600 bg-green-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && !notification.read) ||
                         (filter === 'high' && notification.priority === 'high') ||
                         notification.category === filter;
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

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
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <Bell className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">Notifikasi</h2>
                <p className="text-blue-100">{unreadCount} notifikasi belum dibaca</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/20 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70 w-5 h-5" />
            <input
              type="text"
              placeholder="Cari notifikasi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/20 border border-white/30 rounded-xl text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'all', label: 'Semua', count: notifications.length },
              { key: 'unread', label: 'Belum Dibaca', count: unreadCount },
              { key: 'high', label: 'Prioritas Tinggi', count: notifications.filter(n => n.priority === 'high').length },
              { key: 'transaction', label: 'Transaksi', count: notifications.filter(n => n.category === 'transaction').length },
              { key: 'inventory', label: 'Stok', count: notifications.filter(n => n.category === 'inventory').length },
              { key: 'complaint', label: 'Pengaduan', count: notifications.filter(n => n.category === 'complaint').length }
            ].map((filterOption) => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  filter === filterOption.key
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-100'
                }`}
              >
                {filterOption.label} ({filterOption.count})
              </button>
            ))}
          </div>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <Bell className="w-16 h-16 mb-4 text-gray-300" />
              <p className="text-lg font-medium">Tidak ada notifikasi</p>
              <p className="text-sm">Semua notifikasi sudah dibaca atau tidak ada yang sesuai filter</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredNotifications.map((notification) => {
                const Icon = getNotificationIcon(notification.type);
                return (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-6 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notification.read ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${getNotificationColor(notification.type)}`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="text-lg font-semibold text-gray-800 leading-tight">{notification.title}</h4>
                          <div className="flex items-center space-x-2 ml-4">
                            <div className={`w-2 h-2 rounded-full ${getPriorityColor(notification.priority)}`}></div>
                            <button className="p-1 rounded hover:bg-gray-200">
                              <MoreVertical className="w-4 h-4 text-gray-400" />
                            </button>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-3 leading-relaxed">{notification.message}</p>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-gray-500">{notification.time}</span>
                          <div className="flex items-center space-x-2">
                            {!notification.read && (
                              <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">Baru</span>
                            )}
                            <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs rounded-full capitalize">
                              {notification.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <Button variant="secondary" size="sm">
              Tandai Semua Dibaca
            </Button>
            <div className="flex space-x-2">
              <Button variant="secondary" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter Lanjutan
              </Button>
              <Button variant="primary" size="sm">
                Pengaturan Notifikasi
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotificationPanel;