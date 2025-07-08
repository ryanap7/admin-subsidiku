import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Edit,
  MapPin,
  Package,
  TrendingUp,
  Calendar,
  FileText,
  Plus,
  Truck,
  BarChart3,
  Navigation,
} from "lucide-react";
import { Agent, Transaction } from "../types";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import Modal from "../components/UI/Modal";
import GoogleMap from "../components/UI/GoogleMap";

const AgentDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showStockModal, setShowStockModal] = useState(false);
  const [showStockHistoryModal, setShowStockHistoryModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);

  // Mock data - in real app, fetch based on ID
  const agent: Agent = {
    id: id || "1",
    name: "Kios Makmur Jaya",
    address: "Jl. Sudirman No. 45, Bantul, Yogyakarta",
    coordinates: { lat: -7.8753849, lng: 110.3261904 },
    status: "active",
    capacity: 1000,
    currentStock: 750,
    district: "Bantul",
  };

  const stockHistory = [
    {
      date: "2024-01-15",
      stock: 750,
      change: -50,
      type: "out",
      description: "Penjualan ke penerima subsidi",
    },
    {
      date: "2024-01-14",
      stock: 800,
      change: +200,
      type: "in",
      description: "Pengiriman dari gudang pusat",
    },
    {
      date: "2024-01-13",
      stock: 600,
      change: -100,
      type: "out",
      description: "Penjualan ke penerima subsidi",
    },
    {
      date: "2024-01-12",
      stock: 700,
      change: -75,
      type: "out",
      description: "Penjualan ke penerima subsidi",
    },
    {
      date: "2024-01-11",
      stock: 775,
      change: +300,
      type: "in",
      description: "Pengiriman dari gudang pusat",
    },
  ];

  const deliverySchedule = [
    {
      id: "1",
      date: "2024-01-20",
      product: "Pupuk",
      quantity: 500,
      status: "scheduled",
      supplier: "PT Pupuk Indonesia",
    },
    {
      id: "2",
      date: "2024-01-25",
      product: "LPG",
      quantity: 100,
      status: "confirmed",
      supplier: "PT Pertamina",
    },
    {
      id: "3",
      date: "2024-02-01",
      product: "Pupuk",
      quantity: 300,
      status: "pending",
      supplier: "PT Pupuk Indonesia",
    },
  ];

  const recentTransactions: Transaction[] = [
    {
      id: "TXN001",
      date: "2024-01-15",
      recipientNik: "3402141234567890",
      recipientName: "Budi Santoso",
      product: "pupuk",
      quantity: 25,
      agentName: agent.name,
      status: "completed",
      amount: 125000,
    },
    {
      id: "TXN002",
      date: "2024-01-15",
      recipientNik: "3402141234567891",
      recipientName: "Siti Aminah",
      product: "LPG",
      quantity: 3,
      agentName: agent.name,
      status: "completed",
      amount: 45000,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStockStatus = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    if (percentage <= 20)
      return {
        color: "bg-red-500",
        text: "Stok Rendah",
        textColor: "text-red-600",
      };
    if (percentage <= 50)
      return {
        color: "bg-yellow-500",
        text: "Stok Sedang",
        textColor: "text-yellow-600",
      };
    return {
      color: "bg-green-500",
      text: "Stok Cukup",
      textColor: "text-green-600",
    };
  };

  const getDeliveryStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800";
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const stockStatus = getStockStatus(agent.currentStock, agent.capacity);
  const utilizationPercentage = (agent.currentStock / agent.capacity) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center space-x-4">
          <Button variant="secondary" onClick={() => navigate("/agents")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{agent.name}</h1>
            <p className="text-gray-600 mt-1">Detail Agen & Kios</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowMapModal(true)}>
            <MapPin className="w-4 h-4 mr-2" />
            Lihat Peta
          </Button>
          <Button variant="secondary" onClick={() => setShowEditModal(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Data
          </Button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Stok Saat Ini</p>
                <p className="text-2xl font-bold text-gray-800">
                  {agent.currentStock}
                </p>
                <p className={`text-xs font-medium ${stockStatus.textColor}`}>
                  {stockStatus.text}
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Kapasitas</p>
                <p className="text-2xl font-bold text-gray-800">
                  {agent.capacity}
                </p>
                <p className="text-xs text-gray-500">Maksimum</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Utilisasi</p>
                <p className="text-2xl font-bold text-gray-800">
                  {Math.round(utilizationPercentage)}%
                </p>
                <p className="text-xs text-gray-500">Dari kapasitas</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Transaksi Hari Ini</p>
                <p className="text-2xl font-bold text-gray-800">12</p>
                <p className="text-xs text-green-600">+8% dari kemarin</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Agent Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Informasi Agen
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Nama Agen</p>
                  <p className="font-medium text-lg">{agent.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Alamat</p>
                  <p className="font-medium">{agent.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Kecamatan</p>
                  <p className="font-medium">{agent.district}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Koordinat GPS</p>
                  <p className="font-medium">
                    {agent.coordinates.lat}, {agent.coordinates.lng}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                      agent.status
                    )}`}
                  >
                    {agent.status === "active" ? "Aktif" : "Tidak Aktif"}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Utilisasi Stok</p>
                  <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
                    <div
                      className={`h-3 rounded-full ${stockStatus.color}`}
                      style={{ width: `${utilizationPercentage}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round(utilizationPercentage)}% terisi
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Transactions */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Transaksi Terbaru
              </h2>
              <Button variant="secondary" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Lihat Semua
              </Button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      ID
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Tanggal
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Penerima
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Produk
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Jumlah
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {transaction.id}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {transaction.recipientName}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 capitalize">
                        {transaction.product}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {transaction.quantity}{" "}
                        {transaction.product === "pupuk" ? "kg" : "tabung"}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {formatCurrency(transaction.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="space-y-6"
        >
          {/* Stock Management */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Manajemen Stok
            </h3>
            <div className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-800">
                  {agent.currentStock}
                </div>
                <div className="text-sm text-gray-600">
                  dari {agent.capacity} kapasitas
                </div>
              </div>
              <div className="space-y-2">
                <Button
                  variant="primary"
                  size="sm"
                  className="w-full"
                  onClick={() => setShowStockModal(true)}
                >
                  <Package className="w-4 h-4 mr-2" />
                  Tambah Stok
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => setShowStockHistoryModal(true)}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Riwayat Stok
                </Button>
              </div>
            </div>
          </Card>

          {/* Stock History Preview */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Riwayat Stok Terbaru
            </h3>
            <div className="space-y-3">
              {stockHistory.slice(0, 3).map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                >
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {entry.stock}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(entry.date)}
                    </p>
                  </div>
                  <div
                    className={`text-sm font-medium ${
                      entry.type === "in" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {entry.type === "in" ? "+" : ""}
                    {entry.change}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Aksi Cepat
            </h3>
            <div className="space-y-2">
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => setShowDeliveryModal(true)}
              >
                <Truck className="w-4 h-4 mr-2" />
                Jadwal Pengiriman
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => setShowReportModal(true)}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Laporan Bulanan
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={() => setShowLocationModal(true)}
              >
                <Navigation className="w-4 h-4 mr-2" />
                Update Lokasi
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Data Agen"
        size="lg"
      >
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Agen
              </label>
              <input
                type="text"
                defaultValue={agent.name}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kecamatan
              </label>
              <select
                defaultValue={agent.district}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="Bantul">Bantul</option>
                <option value="Sleman">Sleman</option>
                <option value="Kulon Progo">Kulon Progo</option>
                <option value="Gunung Kidul">Gunung Kidul</option>
                <option value="Yogyakarta">Yogyakarta</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alamat Lengkap
            </label>
            <textarea
              defaultValue={agent.address}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                defaultValue={agent.coordinates.lat}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                defaultValue={agent.coordinates.lng}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kapasitas Maksimum
            </label>
            <input
              type="number"
              defaultValue={agent.capacity}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Batal
            </Button>
            <Button variant="primary">Simpan Perubahan</Button>
          </div>
        </form>
      </Modal>

      {/* Map Modal */}
      <Modal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        title="Lokasi Agen"
        size="xl"
      >
        <div className="space-y-4">
          <GoogleMap
            center={agent.coordinates}
            zoom={15}
            markers={[
              {
                position: agent.coordinates,
                title: agent.name,
                info: agent.address,
              },
            ]}
            height="400px"
          />
          <div className="p-4 bg-blue-50 rounded-xl">
            <h4 className="font-medium text-blue-800 mb-2">{agent.name}</h4>
            <p className="text-sm text-blue-700">{agent.address}</p>
            <div className="mt-3 flex gap-2">
              <Button variant="secondary" size="sm">
                <MapPin className="w-4 h-4 mr-2" />
                Buka di Google Maps
              </Button>
              <Button variant="secondary" size="sm">
                Dapatkan Arah
              </Button>
            </div>
          </div>
        </div>
      </Modal>

      {/* Stock Modal */}
      <Modal
        isOpen={showStockModal}
        onClose={() => setShowStockModal(false)}
        title="Tambah Stok"
        size="md"
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jenis Produk
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option value="">Pilih Produk</option>
              <option value="pupuk">Pupuk</option>
              <option value="LPG">LPG</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah Stok
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Masukkan jumlah stok"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Catatan
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={3}
              placeholder="Catatan tambahan (opsional)"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowStockModal(false)}
            >
              Batal
            </Button>
            <Button variant="primary">Tambah Stok</Button>
          </div>
        </form>
      </Modal>

      {/* Stock History Modal */}
      <Modal
        isOpen={showStockHistoryModal}
        onClose={() => setShowStockHistoryModal(false)}
        title="Riwayat Stok"
        size="lg"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Riwayat perubahan stok 30 hari terakhir
            </p>
            <Button variant="secondary" size="sm">
              <FileText className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
          <div className="max-h-96 overflow-y-auto">
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Tanggal
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Stok
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Perubahan
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Keterangan
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {stockHistory.map((entry, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatDate(entry.date)}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {entry.stock}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`font-medium ${
                          entry.type === "in"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {entry.type === "in" ? "+" : ""}
                        {entry.change}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {entry.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>

      {/* Delivery Schedule Modal */}
      <Modal
        isOpen={showDeliveryModal}
        onClose={() => setShowDeliveryModal(false)}
        title="Jadwal Pengiriman"
        size="lg"
      >
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Jadwal pengiriman stok mendatang
            </p>
            <Button variant="primary" size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Jadwal
            </Button>
          </div>
          <div className="space-y-3">
            {deliverySchedule.map((delivery) => (
              <div
                key={delivery.id}
                className="p-4 border border-gray-200 rounded-xl"
              >
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-gray-800">
                    {delivery.product}
                  </h4>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${getDeliveryStatusColor(
                      delivery.status
                    )}`}
                  >
                    {delivery.status === "confirmed"
                      ? "Dikonfirmasi"
                      : delivery.status === "scheduled"
                      ? "Dijadwalkan"
                      : "Pending"}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Tanggal</p>
                    <p className="font-medium">{formatDate(delivery.date)}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Jumlah</p>
                    <p className="font-medium">
                      {delivery.quantity}{" "}
                      {delivery.product === "Pupuk" ? "kg" : "tabung"}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-600">Supplier</p>
                    <p className="font-medium">{delivery.supplier}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Modal>

      {/* Monthly Report Modal */}
      <Modal
        isOpen={showReportModal}
        onClose={() => setShowReportModal(false)}
        title="Laporan Bulanan"
        size="lg"
      >
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-xl">
              <h4 className="font-medium text-blue-800 mb-2">
                Total Transaksi
              </h4>
              <p className="text-2xl font-bold text-blue-900">156</p>
              <p className="text-sm text-blue-700">+12% dari bulan lalu</p>
            </div>
            <div className="p-4 bg-green-50 rounded-xl">
              <h4 className="font-medium text-green-800 mb-2">
                Total Penjualan
              </h4>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(4500000)}
              </p>
              <p className="text-sm text-green-700">+8% dari bulan lalu</p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-medium text-gray-800">Ringkasan Aktivitas</h4>
            <div className="space-y-2">
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Stok Masuk</span>
                <span className="font-medium">1,200 kg</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Stok Keluar</span>
                <span className="font-medium">950 kg</span>
              </div>
              <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Rata-rata Harian</span>
                <span className="font-medium">31 kg/hari</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <Button variant="secondary">
              <FileText className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
            <Button variant="primary">
              <FileText className="w-4 h-4 mr-2" />
              Download Excel
            </Button>
          </div>
        </div>
      </Modal>

      {/* Update Location Modal */}
      <Modal
        isOpen={showLocationModal}
        onClose={() => setShowLocationModal(false)}
        title="Update Lokasi"
        size="md"
      >
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Latitude
              </label>
              <input
                type="number"
                step="any"
                defaultValue={agent.coordinates.lat}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Longitude
              </label>
              <input
                type="number"
                step="any"
                defaultValue={agent.coordinates.lng}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alamat Baru
            </label>
            <textarea
              defaultValue={agent.address}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={3}
            />
          </div>
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-xl">
            <p className="text-sm text-yellow-800">
              <strong>Catatan:</strong> Perubahan lokasi akan mempengaruhi
              perhitungan jarak dan rute pengiriman.
            </p>
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowLocationModal(false)}
            >
              Batal
            </Button>
            <Button variant="primary">Update Lokasi</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AgentDetailPage;
