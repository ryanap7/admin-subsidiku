import { motion } from "framer-motion";
import {
  ChevronDown,
  DollarSign,
  Download,
  Edit,
  Eye,
  Plus,
  Search,
  TrendingDown,
  TrendingUp,
  UserX,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/UI/Button";
import Card from "../components/UI/Card";
import Modal from "../components/UI/Modal";
import { Recipient } from "../types";

const RecipientsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSubsidy, setFilterSubsidy] = useState("all");
  const [filterClassification, setFilterClassification] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [selectedRecipient, setSelectedRecipient] = useState<Recipient | null>(
    null
  );

  const mockRecipients: Recipient[] = [
    {
      id: "1",
      nik: "3402141234567890",
      name: "Budi Santoso",
      address: "Jl. Mawar No. 123, Bantul",
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
    },
    {
      id: "2",
      nik: "3402141234567891",
      name: "Siti Aminah",
      address: "Jl. Melati No. 456, Sleman",
      district: "Sleman",
      subsidyType: "pupuk",
      status: "active",
      remainingQuota: 30,
      monthlyQuota: 40,
      lastTransaction: "2024-01-14",
      classification: "middle",
      income: 3500000,
      familyMembers: 3,
      landSize: 1.2,
      houseOwnership: "owned",
      vehicleOwnership: ["sepeda motor"],
      bankAccount: true,
    },
    {
      id: "3",
      nik: "3402141234567892",
      name: "Ahmad Wijaya",
      address: "Jl. Anggrek No. 789, Kulon Progo",
      district: "Kulon Progo",
      subsidyType: "LPG",
      status: "suspended",
      remainingQuota: 0,
      monthlyQuota: 25,
      lastTransaction: "2024-01-10",
      classification: "rich",
      income: 8000000,
      familyMembers: 2,
      houseOwnership: "owned",
      vehicleOwnership: ["mobil", "sepeda motor"],
      bankAccount: true,
    },
  ];

  const filteredRecipients = mockRecipients.filter((recipient) => {
    const matchesSearch =
      recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      recipient.nik.includes(searchTerm);
    const matchesStatus =
      filterStatus === "all" || recipient.status === filterStatus;
    const matchesSubsidy =
      filterSubsidy === "all" || recipient.subsidyType === filterSubsidy;
    const matchesClassification =
      filterClassification === "all" ||
      recipient.classification === filterClassification;

    return (
      matchesSearch && matchesStatus && matchesSubsidy && matchesClassification
    );
  });

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

  const handleAddRecipient = () => {
    setShowAddModal(true);
  };

  const handleViewDetails = (recipient: Recipient) => {
    navigate(`/recipients/${recipient.id}`);
  };

  const handleEditRecipient = (recipient: Recipient) => {
    setSelectedRecipient(recipient);
    setShowAddModal(true);
  };

  const handleSuspendRecipient = (recipient: Recipient) => {
    setSelectedRecipient(recipient);
    setShowSuspendModal(true);
  };

  // Calculate statistics
  const totalRecipients = mockRecipients.length;
  const activeRecipients = mockRecipients.filter(
    (r) => r.status === "active"
  ).length;
  const poorRecipients = mockRecipients.filter(
    (r) => r.classification === "poor"
  ).length;
  const middleRecipients = mockRecipients.filter(
    (r) => r.classification === "middle"
  ).length;
  const richRecipients = mockRecipients.filter(
    (r) => r.classification === "rich"
  ).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Penerima Subsidi</h1>
          <p className="text-gray-600 mt-1">
            Kelola data penerima subsidi pupuk dan LPG dengan klasifikasi
            ekonomi
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => {}}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="primary" onClick={handleAddRecipient}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Penerima
          </Button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Penerima</p>
                <p className="text-2xl font-bold text-gray-800">
                  {totalRecipients.toLocaleString()}
                </p>
                <p className="text-xs text-green-600 mt-1">
                  +5.2% dari bulan lalu
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-blue-600" />
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
                <p className="text-sm text-gray-600">Kurang Mampu</p>
                <p className="text-2xl font-bold text-red-600">
                  {poorRecipients}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {((poorRecipients / totalRecipients) * 100).toFixed(1)}% dari
                  total
                </p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-red-600" />
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
                <p className="text-sm text-gray-600">Menengah</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {middleRecipients}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {((middleRecipients / totalRecipients) * 100).toFixed(1)}%
                  dari total
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-yellow-600" />
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
                <p className="text-sm text-gray-600">Mampu</p>
                <p className="text-2xl font-bold text-green-600">
                  {richRecipients}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {((richRecipients / totalRecipients) * 100).toFixed(1)}% dari
                  total
                </p>
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
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Penerima Aktif</p>
                <p className="text-2xl font-bold text-blue-600">
                  {activeRecipients}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {((activeRecipients / totalRecipients) * 100).toFixed(1)}%
                  dari total
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Eye className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama atau NIK..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="appearance-none pl-4 pr-12 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                >
                  <option value="all">Semua Status</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Tidak Aktif</option>
                  <option value="suspended">Ditangguhkan</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={filterSubsidy}
                  onChange={(e) => setFilterSubsidy(e.target.value)}
                  className="appearance-none pl-4 pr-12 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                >
                  <option value="all">Semua Jenis</option>
                  <option value="pupuk">Pupuk</option>
                  <option value="LPG">LPG</option>
                  <option value="both">Keduanya</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={filterClassification}
                  onChange={(e) => setFilterClassification(e.target.value)}
                  className="appearance-none pl-4 pr-12 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                >
                  <option value="all">Semua Klasifikasi</option>
                  <option value="poor">Kurang Mampu</option>
                  <option value="middle">Menengah</option>
                  <option value="rich">Mampu</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Penerima
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    NIK
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alamat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Klasifikasi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pendapatan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Jenis Subsidi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kuota
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecipients.map((recipient) => {
                  const ClassificationIcon = getClassificationIcon(
                    recipient.classification
                  );
                  return (
                    <motion.tr
                      key={recipient.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-medium text-sm">
                              {recipient.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {recipient.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {recipient.district}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {recipient.nik}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {recipient.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <ClassificationIcon className="w-4 h-4 mr-2 text-gray-400" />
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getClassificationColor(
                              recipient.classification
                            )}`}
                          >
                            {getClassificationLabel(recipient.classification)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatCurrency(recipient.income)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {getSubsidyTypeLabel(recipient.subsidyType)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                            recipient.status
                          )}`}
                        >
                          {recipient.status === "active"
                            ? "Aktif"
                            : recipient.status === "inactive"
                            ? "Tidak Aktif"
                            : "Ditangguhkan"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {recipient.remainingQuota} / {recipient.monthlyQuota}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewDetails(recipient)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEditRecipient(recipient)}
                            className="text-green-600 hover:text-green-800 transition-colors"
                            title="Edit Data"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleSuspendRecipient(recipient)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                            title="Tangguhkan"
                          >
                            <UserX className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {/* Add/Edit Recipient Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedRecipient(null);
        }}
        title={
          selectedRecipient
            ? "Edit Penerima Subsidi"
            : "Tambah Penerima Subsidi"
        }
        size="xl"
      >
        <form className="space-y-8">
          {/* Tingkatkan jarak antar section */}
          {/* Informasi Pribadi */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Informasi Pribadi
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* NIK */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  NIK
                </label>
                <input
                  type="text"
                  defaultValue={selectedRecipient?.nik || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Masukkan NIK"
                />
              </div>

              {/* Nama Lengkap */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  defaultValue={selectedRecipient?.name || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Masukkan nama lengkap"
                />
              </div>
            </div>

            {/* Alamat */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Alamat
              </label>
              <textarea
                defaultValue={selectedRecipient?.address || ""}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                rows={3}
                placeholder="Masukkan alamat lengkap"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Kecamatan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kecamatan
                </label>
                <div className="relative">
                  <select
                    defaultValue={selectedRecipient?.district || ""}
                    className="appearance-none w-full pl-3 pr-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                  >
                    <option value="">Pilih Kecamatan</option>
                    <option value="bantul">Bantul</option>
                    <option value="sleman">Sleman</option>
                    <option value="kulon-progo">Kulon Progo</option>
                    <option value="gunung-kidul">Gunung Kidul</option>
                    <option value="yogyakarta">Yogyakarta</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>

              {/* Jenis Subsidi */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jenis Subsidi
                </label>
                <div className="relative">
                  <select
                    defaultValue={selectedRecipient?.subsidyType || ""}
                    className="appearance-none w-full pl-3 pr-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                  >
                    <option value="">Pilih Jenis Subsidi</option>
                    <option value="pupuk">Pupuk</option>
                    <option value="LPG">LPG</option>
                    <option value="both">Keduanya</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>
          {/* Informasi Ekonomi */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">
              Informasi Ekonomi
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pendapatan Bulanan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Pendapatan Bulanan
                </label>
                <input
                  type="number"
                  defaultValue={selectedRecipient?.income || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Masukkan pendapatan bulanan"
                />
              </div>

              {/* Jumlah Anggota Keluarga */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jumlah Anggota Keluarga
                </label>
                <input
                  type="number"
                  defaultValue={selectedRecipient?.familyMembers || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Masukkan jumlah anggota keluarga"
                />
              </div>

              {/* Luas Lahan */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Luas Lahan (Ha)
                </label>
                <input
                  type="number"
                  step="0.1"
                  defaultValue={selectedRecipient?.landSize || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Masukkan luas lahan"
                />
              </div>

              {/* Status Kepemilikan Rumah */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status Kepemilikan Rumah
                </label>
                <div className="relative">
                  <select
                    defaultValue={selectedRecipient?.houseOwnership || ""}
                    className="appearance-none w-full pl-3 pr-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                  >
                    <option value="">Pilih Status</option>
                    <option value="owned">Milik Sendiri</option>
                    <option value="rented">Sewa</option>
                    <option value="family">Milik Keluarga</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>

              {/* Nomor Kartu Jaminan Sosial */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nomor Kartu Jaminan Sosial
                </label>
                <input
                  type="text"
                  defaultValue={selectedRecipient?.socialSecurityNumber || ""}
                  className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Masukkan nomor KIS/BPJS"
                />
              </div>

              {/* Memiliki Rekening Bank */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Memiliki Rekening Bank
                </label>
                <div className="flex items-center space-x-4 mt-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="bankAccount"
                      value="true"
                      defaultChecked={selectedRecipient?.bankAccount}
                      className="mr-2"
                    />
                    Ya
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="bankAccount"
                      value="false"
                      defaultChecked={!selectedRecipient?.bankAccount}
                      className="mr-2"
                    />
                    Tidak
                  </label>
                </div>
              </div>
            </div>
          </div>
          {/* Tombol Aksi */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setShowAddModal(false);
                setSelectedRecipient(null);
              }}
            >
              Batal
            </Button>
            <Button variant="primary">
              {selectedRecipient ? "Simpan Perubahan" : "Simpan"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Suspend Modal */}
      <Modal
        isOpen={showSuspendModal}
        onClose={() => {
          setShowSuspendModal(false);
          setSelectedRecipient(null);
        }}
        title="Tangguhkan Penerima"
        size="md"
      >
        <div className="space-y-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-800">
              Tindakan ini akan menangguhkan akses subsidi untuk{" "}
              <strong>{selectedRecipient?.name}</strong>. Apakah Anda yakin?
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
              onClick={() => {
                setShowSuspendModal(false);
                setSelectedRecipient(null);
              }}
            >
              Batal
            </Button>
            <Button variant="danger">Tangguhkan</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default RecipientsPage;
