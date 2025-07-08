import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MessageSquare, Clock, CheckCircle, AlertCircle, Eye, Edit, ChevronDown } from 'lucide-react';
import { Complaint } from '../types';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';

const ComplaintsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [showFollowUpModal, setShowFollowUpModal] = useState(false);

  const mockComplaints: Complaint[] = [
    {
      id: 'CMP001',
      date: '2024-01-15',
      reporterNik: '3402141234567890',
      reporterName: 'Budi Santoso',
      issue: 'Kuota tidak sesuai',
      description: 'Kuota pupuk yang diterima tidak sesuai dengan yang seharusnya. Seharusnya mendapat 50kg tetapi hanya menerima 30kg.',
      status: 'open',
      assignedTo: undefined,
      resolution: undefined
    },
    {
      id: 'CMP002',
      date: '2024-01-14',
      reporterNik: '3402141234567891',
      reporterName: 'Siti Aminah',
      issue: 'Agen tidak melayani',
      description: 'Agen di daerah saya menolak untuk melayani pengambilan subsidi dengan alasan stok habis, padahal masih ada stok.',
      status: 'in_progress',
      assignedTo: 'Ahmad Subandi',
      resolution: undefined
    },
    {
      id: 'CMP003',
      date: '2024-01-13',
      reporterNik: '3402141234567892',
      reporterName: 'Ahmad Wijaya',
      issue: 'Kualitas produk buruk',
      description: 'Pupuk yang diterima kualitasnya sangat buruk, banyak yang sudah menggumpal dan berbau tidak sedap.',
      status: 'resolved',
      assignedTo: 'Ahmad Subandi',
      resolution: 'Telah dilakukan penggantian produk dan koordinasi dengan supplier untuk meningkatkan kualitas kontrol.'
    }
  ];

  const filteredComplaints = mockComplaints.filter(complaint => {
    const matchesSearch = complaint.reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         complaint.reporterNik.includes(searchTerm) ||
                         complaint.issue.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || complaint.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'open': return 'Baru';
      case 'in_progress': return 'Diproses';
      case 'resolved': return 'Selesai';
      default: return status;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'open': return AlertCircle;
      case 'in_progress': return Clock;
      case 'resolved': return CheckCircle;
      default: return MessageSquare;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleFollowUp = (complaint: Complaint) => {
    setSelectedComplaint(complaint);
    setShowFollowUpModal(true);
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
          <h1 className="text-3xl font-bold text-gray-800">Laporan Pengaduan</h1>
          <p className="text-gray-600 mt-1">Kelola dan tindak lanjuti pengaduan dari penerima subsidi</p>
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
                <p className="text-sm text-gray-600">Total Pengaduan</p>
                <p className="text-2xl font-bold text-gray-800">156</p>
                <p className="text-xs text-gray-500 mt-1">Bulan ini</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
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
                <p className="text-sm text-gray-600">Pengaduan Baru</p>
                <p className="text-2xl font-bold text-red-600">23</p>
                <p className="text-xs text-gray-500 mt-1">Perlu tindak lanjut</p>
              </div>
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
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
                <p className="text-sm text-gray-600">Sedang Diproses</p>
                <p className="text-2xl font-bold text-yellow-600">45</p>
                <p className="text-xs text-gray-500 mt-1">Dalam penanganan</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
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
                <p className="text-sm text-gray-600">Selesai</p>
                <p className="text-2xl font-bold text-green-600">88</p>
                <p className="text-xs text-green-600 mt-1">56.4% resolution rate</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Card className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Cari berdasarkan nama, NIK, atau masalah..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
              >
                <option value="all">Semua Status</option>
                <option value="open">Baru</option>
                <option value="in_progress">Diproses</option>
                <option value="resolved">Selesai</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Complaints Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID Pengaduan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Pelapor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Masalah
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Ditangani Oleh
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredComplaints.map((complaint) => {
                  const StatusIcon = getStatusIcon(complaint.status);
                  return (
                    <motion.tr
                      key={complaint.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {complaint.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(complaint.date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{complaint.reporterName}</div>
                          <div className="text-sm text-gray-500">{complaint.reporterNik}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">{complaint.issue}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <StatusIcon className="w-4 h-4 mr-2 text-gray-400" />
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(complaint.status)}`}>
                            {getStatusLabel(complaint.status)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {complaint.assignedTo || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedComplaint(complaint)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {complaint.status !== 'resolved' && (
                            <button
                              onClick={() => handleFollowUp(complaint)}
                              className="text-green-600 hover:text-green-800 transition-colors"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
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

      {/* Complaint Details Modal */}
      {selectedComplaint && !showFollowUpModal && (
        <Modal
          isOpen={!!selectedComplaint}
          onClose={() => setSelectedComplaint(null)}
          title="Detail Pengaduan"
          size="lg"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Informasi Pengaduan</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">ID Pengaduan</p>
                    <p className="font-medium">{selectedComplaint.id}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Tanggal</p>
                    <p className="font-medium">{formatDate(selectedComplaint.date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Status</p>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedComplaint.status)}`}>
                      {getStatusLabel(selectedComplaint.status)}
                    </span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ditangani Oleh</p>
                    <p className="font-medium">{selectedComplaint.assignedTo || 'Belum ditugaskan'}</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Informasi Pelapor</h3>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Nama Pelapor</p>
                    <p className="font-medium">{selectedComplaint.reporterName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">NIK</p>
                    <p className="font-medium">{selectedComplaint.reporterNik}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Jenis Masalah</p>
                    <p className="font-medium">{selectedComplaint.issue}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Deskripsi Masalah</h3>
              <div className="p-4 bg-gray-50 rounded-xl">
                <p className="text-gray-700">{selectedComplaint.description}</p>
              </div>
            </div>

            {selectedComplaint.resolution && (
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Penyelesaian</h3>
                <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                  <p className="text-green-700">{selectedComplaint.resolution}</p>
                </div>
              </div>
            )}
            
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <Button variant="secondary" onClick={() => setSelectedComplaint(null)}>
                Tutup
              </Button>
              {selectedComplaint.status !== 'resolved' && (
                <Button variant="primary" onClick={() => handleFollowUp(selectedComplaint)}>
                  Tindak Lanjut
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Follow Up Modal */}
      <Modal
        isOpen={showFollowUpModal}
        onClose={() => {
          setShowFollowUpModal(false);
          setSelectedComplaint(null);
        }}
        title="Tindak Lanjut Pengaduan"
        size="md"
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <div className="relative">
              <select className="appearance-none w-full pl-3 pr-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white">
                <option value="in_progress">Sedang Diproses</option>
                <option value="resolved">Selesai</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ditugaskan Kepada</label>
            <div className="relative">
              <select className="appearance-none w-full pl-3 pr-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white">
                <option value="">Pilih Petugas</option>
                <option value="Ahmad Subandi">Ahmad Subandi</option>
                <option value="Siti Nurhaliza">Siti Nurhaliza</option>
                <option value="Budi Prasetyo">Budi Prasetyo</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Catatan Tindak Lanjut</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={4}
              placeholder="Masukkan catatan tindak lanjut atau penyelesaian masalah..."
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              variant="secondary" 
              onClick={() => {
                setShowFollowUpModal(false);
                setSelectedComplaint(null);
              }}
            >
              Batal
            </Button>
            <Button variant="primary">
              Simpan
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ComplaintsPage;