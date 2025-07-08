import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Edit,
  UserX,
  FileText,
  Calendar,
  MapPin,
  Package,
  Plus,
  TrendingUp,
  TrendingDown,
  DollarSign,
} from "lucide-react";
import { Recipient, Transaction } from "../types";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import Modal from "../components/UI/Modal";
import GoogleMap from "../components/UI/GoogleMap";

const RecipientsDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [showQuotaModal, setShowQuotaModal] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);

  // Mock data - in real app, fetch based on ID
  const recipient: Recipient = {
    id: id || "1",
    nik: "3402141234567890",
    name: "Budi Santoso",
    address: "Jl. Mawar No. 123, Bantul, Yogyakarta",
    district: "Bantul",
    subsidyType: "both",
    status: "active",
    remainingQuota: 45,
    monthlyQuota: 50,
    lastTransaction: "2024-01-15",
    classification: "poor",
    income: 1500000,
    familyMembers: 4,
    landSize: 0.5,
    houseOwnership: "owned",
    vehicleOwnership: ["sepeda"],
    bankAccount: false,
    socialSecurityNumber: "KIS123456789",
  };

  const transactions: Transaction[] = [
    {
      id: "TXN001",
      date: "2024-01-15",
      recipientNik: recipient.nik,
      recipientName: recipient.name,
      product: "pupuk",
      quantity: 25,
      agentName: "Kios Makmur Jaya",
      status: "completed",
      amount: 125000,
    },
    {
      id: "TXN002",
      date: "2024-01-10",
      recipientNik: recipient.nik,
      recipientName: recipient.name,
      product: "LPG",
      quantity: 2,
      agentName: "Toko Berkah Tani",
      status: "completed",
      amount: 30000,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-gray-100 text-gray-800";
      case "suspended":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getClassificationColor = (classification: string) => {
    switch (classification) {
      case "poor":
        return "bg-red-100 text-red-800";
      case "middle":
        return "bg-yellow-100 text-yellow-800";
      case "rich":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getClassificationLabel = (classification: string) => {
    switch (classification) {
      case "poor":
        return "Kurang Mampu";
      case "middle":
        return "Menengah";
      case "rich":
        return "Mampu";
      default:
        return classification;
    }
  };

  const getClassificationIcon = (classification: string) => {
    switch (classification) {
      case "poor":
        return TrendingDown;
      case "middle":
        return DollarSign;
      case "rich":
        return TrendingUp;
      default:
        return DollarSign;
    }
  };

  const getSubsidyTypeLabel = (type: string) => {
    switch (type) {
      case "pupuk":
        return "Pupuk";
      case "LPG":
        return "LPG";
      case "both":
        return "Pupuk & LPG";
      default:
        return type;
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

  const handleAddQuota = () => {
    setShowQuotaModal(true);
  };

  const handleViewMap = () => {
    setShowMapModal(true);
  };

  const ClassificationIcon = getClassificationIcon(recipient.classification);

  // Mock coordinates for the recipient address
  const recipientCoordinates = { lat: -7.8753849, lng: 110.3261904 };

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
          <Button variant="secondary" onClick={() => navigate("/recipients")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {recipient.name}
            </h1>
            <p className="text-gray-600 mt-1">Detail Penerima Subsidi</p>
          </div>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowEditModal(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Data
          </Button>
          <Button variant="danger" onClick={() => setShowSuspendModal(true)}>
            <UserX className="w-4 h-4 mr-2" />
            Tangguhkan
          </Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          {/* Personal Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Informasi Pribadi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">NIK</p>
                  <p className="font-medium text-lg">{recipient.nik}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Nama Lengkap</p>
                  <p className="font-medium text-lg">{recipient.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Kecamatan</p>
                  <p className="font-medium">{recipient.district}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    Jumlah Anggota Keluarga
                  </p>
                  <p className="font-medium">{recipient.familyMembers} orang</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Alamat Lengkap</p>
                  <p className="font-medium">{recipient.address}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Status</p>
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                      recipient.status
                    )}`}
                  >
                    {recipient.status === "active"
                      ? "Aktif"
                      : recipient.status === "inactive"
                      ? "Tidak Aktif"
                      : "Ditangguhkan"}
                  </span>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Jenis Subsidi</p>
                  <p className="font-medium">
                    {getSubsidyTypeLabel(recipient.subsidyType)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Klasifikasi Ekonomi</p>
                  <div className="flex items-center space-x-2">
                    <ClassificationIcon className="w-4 h-4 text-gray-400" />
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getClassificationColor(
                        recipient.classification
                      )}`}
                    >
                      {getClassificationLabel(recipient.classification)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          {/* Economic Information */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Informasi Ekonomi
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Pendapatan Bulanan</p>
                  <p className="font-medium text-lg">
                    {formatCurrency(recipient.income)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Luas Lahan</p>
                  <p className="font-medium">{recipient.landSize} Ha</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    Status Kepemilikan Rumah
                  </p>
                  <p className="font-medium capitalize">
                    {recipient.houseOwnership === "owned"
                      ? "Milik Sendiri"
                      : recipient.houseOwnership === "rented"
                      ? "Sewa"
                      : "Milik Keluarga"}
                  </p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Kepemilikan Kendaraan</p>
                  <p className="font-medium">
                    {recipient.vehicleOwnership.join(", ")}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Rekening Bank</p>
                  <p className="font-medium">
                    {recipient.bankAccount ? "Ya" : "Tidak"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    Nomor Kartu Jaminan Sosial
                  </p>
                  <p className="font-medium">
                    {recipient.socialSecurityNumber || "-"}
                  </p>
                </div>
              </div>
            </div>
          </Card>

          {/* Transaction History */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-800">
                Riwayat Transaksi
              </h2>
              <Button variant="secondary" size="sm">
                <FileText className="w-4 h-4 mr-2" />
                Export
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
                      Produk
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Jumlah
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Agen
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {transactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">
                        {transaction.id}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {formatDate(transaction.date)}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900 capitalize">
                        {transaction.product}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {transaction.quantity}{" "}
                        {transaction.product === "pupuk" ? "kg" : "tabung"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {transaction.agentName}
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
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          {/* Quota Information */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Informasi Kuota
            </h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Kuota Bulanan</span>
                  <span className="text-sm font-medium">
                    {recipient.monthlyQuota}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">Kuota Tersisa</span>
                  <span className="text-sm font-medium text-green-600">
                    {recipient.remainingQuota}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-600 h-2 rounded-full"
                    style={{
                      width: `${
                        (recipient.remainingQuota / recipient.monthlyQuota) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {Math.round(
                    (recipient.remainingQuota / recipient.monthlyQuota) * 100
                  )}
                  % tersisa
                </p>
              </div>
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={handleAddQuota}
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Kuota
              </Button>
            </div>
          </Card>

          {/* Classification Details */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Detail Klasifikasi
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-center p-4 bg-gray-50 rounded-xl">
                <div className="text-center">
                  <ClassificationIcon className="w-8 h-8 mx-auto mb-2 text-gray-600" />
                  <span
                    className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getClassificationColor(
                      recipient.classification
                    )}`}
                  >
                    {getClassificationLabel(recipient.classification)}
                  </span>
                </div>
              </div>
              <div className="text-sm text-gray-600">
                <p className="mb-2">Kriteria klasifikasi berdasarkan:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Pendapatan per bulan</li>
                  <li>• Jumlah anggota keluarga</li>
                  <li>• Kepemilikan aset</li>
                  <li>• Status jaminan sosial</li>
                </ul>
              </div>
            </div>
          </Card>

          {/* Quick Stats */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Statistik
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Transaksi</span>
                <span className="font-medium">{transactions.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  Transaksi Terakhir
                </span>
                <span className="font-medium">
                  {formatDate(recipient.lastTransaction || "")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Total Pengeluaran</span>
                <span className="font-medium">
                  {formatCurrency(
                    transactions.reduce((sum, t) => sum + t.amount, 0)
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">
                  Pendapatan per Kapita
                </span>
                <span className="font-medium">
                  {formatCurrency(recipient.income / recipient.familyMembers)}
                </span>
              </div>
            </div>
          </Card>

          {/* Location */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Lokasi</h3>
            <div className="space-y-3">
              <p className="text-sm text-gray-600">{recipient.address}</p>
              <Button
                variant="secondary"
                size="sm"
                className="w-full"
                onClick={handleViewMap}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Lihat di Peta
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Data Penerima"
        size="xl"
      >
        <form className="space-y-6">
          {/* Personal Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Informasi Pribadi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NIK
                </label>
                <input
                  type="text"
                  defaultValue={recipient.nik}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  defaultValue={recipient.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat
              </label>
              <textarea
                defaultValue={recipient.address}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={3}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Kecamatan
                </label>
                <select
                  defaultValue={recipient.district}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="Bantul">Bantul</option>
                  <option value="Sleman">Sleman</option>
                  <option value="Kulon Progo">Kulon Progo</option>
                  <option value="Gunung Kidul">Gunung Kidul</option>
                  <option value="Yogyakarta">Yogyakarta</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jenis Subsidi
                </label>
                <select
                  defaultValue={recipient.subsidyType}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="pupuk">Pupuk</option>
                  <option value="LPG">LPG</option>
                  <option value="both">Keduanya</option>
                </select>
              </div>
            </div>
          </div>

          {/* Economic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Informasi Ekonomi
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pendapatan Bulanan
                </label>
                <input
                  type="number"
                  defaultValue={recipient.income}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Anggota Keluarga
                </label>
                <input
                  type="number"
                  defaultValue={recipient.familyMembers}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Luas Lahan (Ha)
                </label>
                <input
                  type="number"
                  step="0.1"
                  defaultValue={recipient.landSize}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status Kepemilikan Rumah
                </label>
                <select
                  defaultValue={recipient.houseOwnership}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="owned">Milik Sendiri</option>
                  <option value="rented">Sewa</option>
                  <option value="family">Milik Keluarga</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Batal
            </Button>
            <Button variant="primary">Simpan Perubahan</Button>
          </div>
        </form>
      </Modal>

      {/* Suspend Modal */}
      <Modal
        isOpen={showSuspendModal}
        onClose={() => setShowSuspendModal(false)}
        title="Tangguhkan Penerima"
        size="md"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-800">
              Tindakan ini akan menangguhkan akses subsidi untuk penerima ini.
              Apakah Anda yakin?
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alasan Penangguhan
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={3}
              placeholder="Masukkan alasan penangguhan..."
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowSuspendModal(false)}
            >
              Batal
            </Button>
            <Button variant="danger">Tangguhkan</Button>
          </div>
        </div>
      </Modal>

      {/* Add Quota Modal */}
      <Modal
        isOpen={showQuotaModal}
        onClose={() => setShowQuotaModal(false)}
        title="Tambah Kuota"
        size="md"
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jenis Subsidi
            </label>
            <select className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent">
              <option value="">Pilih Jenis Subsidi</option>
              <option value="pupuk">Pupuk</option>
              <option value="LPG">LPG</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah Kuota Tambahan
            </label>
            <input
              type="number"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Masukkan jumlah kuota"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alasan Penambahan
            </label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={3}
              placeholder="Masukkan alasan penambahan kuota..."
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowQuotaModal(false)}
            >
              Batal
            </Button>
            <Button variant="primary">Tambah Kuota</Button>
          </div>
        </form>
      </Modal>

      {/* Map Modal */}
      <Modal
        isOpen={showMapModal}
        onClose={() => setShowMapModal(false)}
        title="Lokasi Penerima"
        size="xl"
      >
        <div className="space-y-4">
          <GoogleMap
            center={recipientCoordinates}
            zoom={15}
            markers={[
              {
                position: recipientCoordinates,
                title: recipient.name,
                info: recipient.address,
              },
            ]}
            height="400px"
          />
          <div className="p-4 bg-blue-50 rounded-xl">
            <h4 className="font-medium text-blue-800 mb-2">{recipient.name}</h4>
            <p className="text-sm text-blue-700">{recipient.address}</p>
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
    </div>
  );
};

export default RecipientsDetailPage;
