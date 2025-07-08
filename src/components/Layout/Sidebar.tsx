import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  LogOut,
  MessageSquare,
  Package,
  Settings,
  Store,
  TrendingUp,
  Users,
} from "lucide-react";
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const location = useLocation();
  const { logout } = useAuth();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Users, label: "Penerima Subsidi", path: "/recipients" },
    { icon: Package, label: "Manajemen Kuota", path: "/quota" },
    { icon: Store, label: "Agen & Kios", path: "/agents" },
    { icon: TrendingUp, label: "Analisis Kelayakan", path: "/analysis" },
    { icon: FileText, label: "Transaksi", path: "/transactions" },
    { icon: MessageSquare, label: "Pengaduan", path: "/complaints" },
    { icon: Settings, label: "Pengaturan", path: "/settings" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <motion.aside
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`fixed left-0 top-0 z-40 h-full bg-white border-r border-gray-200 transition-all duration-300 ${
        isOpen ? "w-64" : "w-16"
      }`}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isOpen ? 1 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex items-center space-x-3"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-blue-500 rounded-lg flex items-center justify-center">
              <Package className="w-5 h-5 text-white" />
            </div>
            {isOpen && (
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  SubsidiKu
                </h2>
                <p className="text-xs text-gray-500">Admin Panel</p>
              </div>
            )}
          </motion.div>
          <button
            onClick={onToggle}
            className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isOpen ? (
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            ) : (
              <ChevronRight className="w-5 h-5 text-gray-600" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-200 group ${
                isActive(item.path)
                  ? "bg-gradient-to-r from-green-100 to-blue-100 text-green-700 shadow-sm"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
              }`}
            >
              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <item.icon className="w-5 h-5" />
              </motion.div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: isOpen ? 1 : 0 }}
                transition={{ duration: 0.2 }}
                className={`font-medium ${!isOpen && "hidden"}`}
              >
                {item.label}
              </motion.span>
            </Link>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={logout}
            className="flex items-center space-x-3 w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: isOpen ? 1 : 0 }}
              transition={{ duration: 0.2 }}
              className={`font-medium ${!isOpen && "hidden"}`}
            >
              Keluar
            </motion.span>
          </button>
        </div>
      </div>
    </motion.aside>
  );
};

export default Sidebar;
