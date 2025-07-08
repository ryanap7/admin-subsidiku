import { motion } from "framer-motion";
import {
  AlertCircle,
  Clock,
  DollarSign,
  FileText,
  Package,
  Store,
  TrendingDown,
  TrendingUp,
  Users,
} from "lucide-react";
import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";

const DashboardPage: React.FC = () => {
  const stats = [
    {
      title: "Total Penerima Subsidi Aktif",
      value: "12,847",
      change: "+5.2%",
      trend: "up",
      icon: Users,
      color: "from-green-400 to-green-600",
    },
    {
      title: "Total Agen Terdaftar",
      value: "324",
      change: "+2.1%",
      trend: "up",
      icon: Store,
      color: "from-blue-400 to-blue-600",
    },
    {
      title: "Total Transaksi Bulan Ini",
      value: "8,924",
      change: "+12.8%",
      trend: "up",
      icon: FileText,
      color: "from-purple-400 to-purple-600",
    },
    {
      title: "Total Subsidi Disalurkan",
      value: "Rp 2.4M",
      change: "+8.7%",
      trend: "up",
      icon: DollarSign,
      color: "from-orange-400 to-orange-600",
    },
  ];

  const additionalStats = [
    {
      title: "Stok Rendah",
      value: "12",
      description: "Agen dengan stok < 20%",
      icon: AlertCircle,
      color: "text-red-600",
      bgColor: "bg-red-100",
    },
    {
      title: "Transaksi Pending",
      value: "34",
      description: "Menunggu persetujuan",
      icon: Clock,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Pengaduan Aktif",
      value: "8",
      description: "Perlu tindak lanjut",
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Kuota Terpakai",
      value: "78%",
      description: "Dari total kuota bulanan",
      icon: Package,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ];

  const barData = [
    { name: "Bantul", pupuk: 1240, LPG: 890 },
    { name: "Sleman", pupuk: 1890, LPG: 1340 },
    { name: "Kulon Progo", pupuk: 980, LPG: 760 },
    { name: "Gunung Kidul", pupuk: 1560, LPG: 1120 },
    { name: "Yogyakarta", pupuk: 2340, LPG: 1890 },
  ];

  const pieData = [
    { name: "Pupuk", value: 65, color: "#10B981" },
    { name: "LPG", value: 35, color: "#3B82F6" },
  ];

  const trendData = [
    { month: "Jan", transaksi: 6500, subsidi: 1.8 },
    { month: "Feb", transaksi: 7200, subsidi: 2.0 },
    { month: "Mar", transaksi: 6800, subsidi: 1.9 },
    { month: "Apr", transaksi: 8100, subsidi: 2.3 },
    { month: "May", transaksi: 8900, subsidi: 2.4 },
    { month: "Jun", transaksi: 8924, subsidi: 2.4 },
  ];

  const distributionData = [
    { wilayah: "Bantul", penerima: 3200, persentase: 25 },
    { wilayah: "Sleman", penerima: 2800, persentase: 22 },
    { wilayah: "Kulon Progo", penerima: 2100, persentase: 16 },
    { wilayah: "Gunung Kidul", penerima: 2400, persentase: 19 },
    { wilayah: "Yogyakarta", penerima: 2347, persentase: 18 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Selamat datang di panel admin SubsidiKu
          </p>
        </div>
        <Button variant="primary">Unduh Laporan</Button>
      </motion.div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card hover className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stat.value}
                  </p>
                  <div className="flex items-center mt-2">
                    {stat.trend === "up" ? (
                      <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        stat.trend === "up" ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div
                  className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center`}
                >
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {additionalStats.map((stat, index) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
          >
            <Card hover className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {stat.value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stat.description}
                  </p>
                </div>
                <div
                  className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Pemakaian Subsidi per Kabupaten
              </h3>
              <Button variant="secondary" size="sm">
                Lihat Detail
              </Button>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="pupuk" fill="#10B981" radius={[4, 4, 0, 0]} />
                <Bar dataKey="LPG" fill="#3B82F6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Komposisi Jenis Subsidi
              </h3>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {pieData.map((entry, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="text-sm text-gray-600">{entry.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    {entry.value}%
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Trend Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Transaction Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Tren Transaksi 6 Bulan Terakhir
            </h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="transaksi"
                  stroke="#10B981"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </motion.div>

        {/* Distribution by Region */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.1 }}
        >
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Distribusi Penerima per Wilayah
            </h3>
            <div className="space-y-4">
              {distributionData.map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-700">
                      {item.wilayah}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${item.persentase}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-600 w-12 text-right">
                      {item.penerima}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Aktivitas Terbaru
          </h3>
          <div className="space-y-4">
            {[
              {
                action: "Penerima baru ditambahkan",
                user: "Budi Santoso",
                time: "5 menit yang lalu",
                type: "success",
              },
              {
                action: "Kuota bulanan direset",
                user: "Sistem",
                time: "1 jam yang lalu",
                type: "info",
              },
              {
                action: "Transaksi pupuk berhasil",
                user: "Siti Aminah",
                time: "2 jam yang lalu",
                type: "success",
              },
              {
                action: "Agen baru terdaftar",
                user: "Kios Makmur",
                time: "3 jam yang lalu",
                type: "info",
              },
              {
                action: "Pengaduan baru diterima",
                user: "Ahmad Wijaya",
                time: "4 jam yang lalu",
                type: "warning",
              },
            ].map((activity, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      activity.type === "success"
                        ? "bg-green-500"
                        : activity.type === "warning"
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                  ></div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {activity.action}
                    </p>
                    <p className="text-xs text-gray-600">{activity.user}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
