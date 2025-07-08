import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Search,
  RefreshCw,
  Plus,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import { QuotaManagement } from "../types";
import Card from "../components/UI/Card";
import Button from "../components/UI/Button";
import Modal from "../components/UI/Modal";

const QuotaPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterSubsidy, setFilterSubsidy] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [selectedQuota, setSelectedQuota] = useState<QuotaManagement | null>(
    null
  );

  const mockQuotas: QuotaManagement[] = [
    {
      id: "1",
      recipientNik: "3402141234567890",
      recipientName: "Budi Santoso",
      subsidyType: "pupuk",
      monthlyQuota: 50,
      usedQuota: 15,
      remainingQuota: 35,
      lastReset: "2024-01-01",
    },
    {
      id: "2",
      recipientNik: "3402141234567891",
      recipientName: "Siti Aminah",
      subsidyType: "LPG",
      monthlyQuota: 30,
      usedQuota: 25,
      remainingQuota: 5,
      lastReset: "2024-01-01",
    },
    {
      id: "3",
      recipientNik: "3402141234567892",
      recipientName: "Ahmad Wijaya",
      subsidyType: "pupuk",
      monthlyQuota: 40,
      usedQuota: 40,
      remainingQuota: 0,
      lastReset: "2024-01-01",
    },
  ];

  const filteredQuotas = mockQuotas.filter((quota) => {
    const matchesSearch =
      quota.recipientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quota.recipientNik.includes(searchTerm);
    const matchesSubsidy =
      filterSubsidy === "all" || quota.subsidyType === filterSubsidy;

    return matchesSearch && matchesSubsidy;
  });

  const getQuotaStatus = (used: number, total: number) => {
    const percentage = (used / total) * 100;
    if (percentage >= 100) return { color: "bg-red-500", text: "Habis" };
    if (percentage >= 80)
      return { color: "bg-yellow-500", text: "Hampir Habis" };
    return { color: "bg-green-500", text: "Tersedia" };
  };

  const handleAddQuota = (quota?: QuotaManagement) => {
    setSelectedQuota(quota || null);
    setShowAddModal(true);
  };

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
          <h1 className="text-3xl font-bold text-gray-800">Manajemen Kuota</h1>
          <p className="text-gray-600 mt-1">
            Kelola kuota subsidi untuk setiap penerima
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setShowResetModal(true)}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset Kuota Bulanan
          </Button>
          <Button variant="primary" onClick={() => handleAddQuota()}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Kuota
          </Button>
        </div>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Kuota Tersedia</p>
                <p className="text-2xl font-bold text-green-600">120</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Plus className="w-6 h-6 text-green-600" />
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
                <p className="text-sm text-gray-600">Kuota Terpakai</p>
                <p className="text-2xl font-bold text-blue-600">80</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-blue-600" />
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
                <p className="text-sm text-gray-600">Kuota Habis</p>
                <p className="text-2xl font-bold text-red-600">3</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
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
            <div className="relative">
              <select
                value={filterSubsidy}
                onChange={(e) => setFilterSubsidy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
              >
                <option value="all">Semua Jenis Subsidi</option>
                <option value="pupuk">Pupuk</option>
                <option value="LPG">LPG</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Quota Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
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
                    Jenis Subsidi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kuota Bulanan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kuota Terpakai
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kuota Tersisa
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredQuotas.map((quota) => {
                  const status = getQuotaStatus(
                    quota.usedQuota,
                    quota.monthlyQuota
                  );
                  return (
                    <motion.tr
                      key={quota.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {quota.recipientName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {quota.recipientNik}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <span className="capitalize">{quota.subsidyType}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {quota.monthlyQuota}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {quota.usedQuota}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {quota.remainingQuota}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div
                            className={`w-2 h-2 rounded-full mr-2 ${status.color}`}
                          />
                          <span className="text-sm text-gray-900">
                            {status.text}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleAddQuota(quota)}
                        >
                          Tambah Kuota
                        </Button>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>

      {/* Add Quota Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedQuota(null);
        }}
        title={
          selectedQuota
            ? "Tambah Kuota untuk " + selectedQuota.recipientName
            : "Tambah Kuota"
        }
        size="md"
      >
        <form className="space-y-4">
          {!selectedQuota && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NIK Penerima
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Masukkan NIK"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jenis Subsidi
            </label>
            <div className="relative">
              <select
                defaultValue={selectedQuota?.subsidyType || ""}
                className="appearance-none w-full pl-3 pr-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
              >
                <option value="">Pilih Jenis Subsidi</option>
                <option value="pupuk">Pupuk</option>
                <option value="LPG">LPG</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah Kuota
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
              placeholder="Masukkan alasan penambahan kuota"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => {
                setShowAddModal(false);
                setSelectedQuota(null);
              }}
            >
              Batal
            </Button>
            <Button variant="primary">Tambah Kuota</Button>
          </div>
        </form>
      </Modal>

      {/* Reset Quota Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset Kuota Bulanan"
        size="md"
      >
        <div className="space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-xl">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="text-sm text-yellow-800">
                Tindakan ini akan mereset semua kuota bulanan ke nilai awal.
                Apakah Anda yakin?
              </span>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Konfirmasi dengan mengetik "RESET"
            </label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Ketik RESET untuk konfirmasi"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setShowResetModal(false)}
            >
              Batal
            </Button>
            <Button variant="danger">Reset Kuota</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default QuotaPage;
