import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, MapPin, Eye, Edit, Store, Package, AlertCircle, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Agent } from '../types';
import Card from '../components/UI/Card';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';

const AgentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDistrict, setFilterDistrict] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  const mockAgents: Agent[] = [
    {
      id: '1',
      name: 'Kios Makmur Jaya',
      address: 'Jl. Sudirman No. 45, Bantul',
      coordinates: { lat: -7.8753849, lng: 110.3261904 },
      status: 'active',
      capacity: 1000,
      currentStock: 750,
      district: 'Bantul'
    },
    {
      id: '2',
      name: 'Toko Berkah Tani',
      address: 'Jl. Kaliurang KM 5, Sleman',
      coordinates: { lat: -7.7455643, lng: 110.4083594 },
      status: 'active',
      capacity: 800,
      currentStock: 200,
      district: 'Sleman'
    },
    {
      id: '3',
      name: 'Agen Subur Mandiri',
      address: 'Jl. Wates KM 10, Kulon Progo',
      coordinates: { lat: -7.8063153, lng: 110.1640543 },
      status: 'inactive',
      capacity: 600,
      currentStock: 0,
      district: 'Kulon Progo'
    }
  ];

  const filteredAgents = mockAgents.filter(agent => {
    const matchesSearch = agent.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agent.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || agent.status === filterStatus;
    const matchesDistrict = filterDistrict === 'all' || agent.district === filterDistrict;
    
    return matchesSearch && matchesStatus && matchesDistrict;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStockStatus = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    if (percentage <= 20) return { color: 'bg-red-500', text: 'Stok Rendah' };
    if (percentage <= 50) return { color: 'bg-yellow-500', text: 'Stok Sedang' };
    return { color: 'bg-green-500', text: 'Stok Cukup' };
  };

  const handleViewDetails = (agent: Agent) => {
    navigate(`/agents/${agent.id}`);
  };

  const handleEditAgent = (agent: Agent) => {
    setSelectedAgent(agent);
    setShowAddModal(true);
  };

  const handleViewMap = () => {
    navigate('/map');
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
          <h1 className="text-3xl font-bold text-gray-800">Agen & Kios</h1>
          <p className="text-gray-600 mt-1">Kelola data agen dan kios penyalur subsidi</p>
        </div>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={handleViewMap}>
            <MapPin className="w-4 h-4 mr-2" />
            Lihat Peta
          </Button>
          <Button variant="primary" onClick={() => setShowAddModal(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Tambah Agen
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
                <p className="text-sm text-gray-600">Total Agen</p>
                <p className="text-2xl font-bold text-gray-800">324</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Store className="w-6 h-6 text-blue-600" />
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
                <p className="text-sm text-gray-600">Agen Aktif</p>
                <p className="text-2xl font-bold text-green-600">298</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-green-600" />
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
                <p className="text-sm text-gray-600">Stok Rendah</p>
                <p className="text-2xl font-bold text-red-600">12</p>
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
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Kapasitas Total</p>
                <p className="text-2xl font-bold text-purple-600">45,600</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Package className="w-6 h-6 text-purple-600" />
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
                placeholder="Cari berdasarkan nama atau alamat..."
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
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                >
                  <option value="all">Semua Status</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Tidak Aktif</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
              <div className="relative">
                <select
                  value={filterDistrict}
                  onChange={(e) => setFilterDistrict(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
                >
                  <option value="all">Semua Kecamatan</option>
                  <option value="Bantul">Bantul</option>
                  <option value="Sleman">Sleman</option>
                  <option value="Kulon Progo">Kulon Progo</option>
                  <option value="Gunung Kidul">Gunung Kidul</option>
                  <option value="Yogyakarta">Yogyakarta</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Agents Table */}
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
                    Agen
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Alamat
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kecamatan
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stok
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Kapasitas
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAgents.map((agent) => {
                  const stockStatus = getStockStatus(agent.currentStock, agent.capacity);
                  return (
                    <motion.tr
                      key={agent.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                            <Store className="w-5 h-5 text-white" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{agent.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {agent.address}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {agent.district}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(agent.status)}`}>
                          {agent.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${stockStatus.color}`} />
                          <span className="text-sm text-gray-900">{agent.currentStock}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {agent.capacity}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleViewDetails(agent)}
                            className="text-blue-600 hover:text-blue-800 transition-colors"
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleEditAgent(agent)}
                            className="text-green-600 hover:text-green-800 transition-colors"
                            title="Edit Data"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={handleViewMap}
                            className="text-purple-600 hover:text-purple-800 transition-colors"
                            title="Lihat di Peta"
                          >
                            <MapPin className="w-4 h-4" />
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

      {/* Add/Edit Agent Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedAgent(null);
        }}
        title={selectedAgent ? "Edit Agen" : "Tambah Agen Baru"}
        size="lg"
      >
        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nama Agen</label>
              <input
                type="text"
                defaultValue={selectedAgent?.name || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Masukkan nama agen"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kecamatan</label>
              <div className="relative">
                <select 
                  defaultValue={selectedAgent?.district || ''}
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
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Alamat Lengkap</label>
            <textarea
              defaultValue={selectedAgent?.address || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={3}
              placeholder="Masukkan alamat lengkap"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Latitude</label>
              <input
                type="number"
                step="any"
                defaultValue={selectedAgent?.coordinates.lat || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Contoh: -7.8753849"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Longitude</label>
              <input
                type="number"
                step="any"
                defaultValue={selectedAgent?.coordinates.lng || ''}
                className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Contoh: 110.3261904"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Kapasitas Maksimum</label>
            <input
              type="number"
              defaultValue={selectedAgent?.capacity || ''}
              className="w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              placeholder="Masukkan kapasitas maksimum"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <Button 
              variant="secondary" 
              onClick={() => {
                setShowAddModal(false);
                setSelectedAgent(null);
              }}
            >
              Batal
            </Button>
            <Button variant="primary">
              {selectedAgent ? 'Simpan Perubahan' : 'Simpan'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AgentsPage;