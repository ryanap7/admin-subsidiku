import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Menu, User, Settings, LogOut, MessageSquare, AlertTriangle, CheckCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../UI/Button';
import NotificationPanel from '../UI/NotificationPanel';
import ProfilePanel from '../UI/ProfilePanel';

interface TopBarProps {
  onMenuToggle: () => void;
  sidebarOpen: boolean;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuToggle, sidebarOpen }) => {
  const { user, logout } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const roleLabels = {
    admin: 'Administrator',
    operator: 'Operator',
    supervisor: 'Supervisor'
  };

  const unreadCount = 3; // This would come from your notification state

  return (
    <>
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={`fixed top-0 right-0 z-30 bg-white border-b border-gray-200 transition-all duration-300 ${
          sidebarOpen ? 'left-64' : 'left-16'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-4">
          {/* Left side */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onMenuToggle}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors lg:hidden"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Cari data..."
                className="pl-10 pr-4 py-2 w-80 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowNotifications(true)}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-xs text-white font-medium">{unreadCount}</span>
                  </span>
                )}
              </motion.button>
            </div>

            {/* Profile */}
            <button
              onClick={() => setShowProfile(true)}
              className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
            >
              <img
                src={user?.avatar || 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&dpr=1'}
                alt="User Avatar"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium text-gray-800">{user?.name}</p>
                <p className="text-xs text-gray-500">{roleLabels[user?.role || 'admin']}</p>
              </div>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {/* Profile Panel */}
      <ProfilePanel
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />
    </>
  );
};

export default TopBar;