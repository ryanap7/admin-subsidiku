import { motion } from 'framer-motion';
import _ from 'lodash';
import { AlertCircle, ChevronDown, Edit, Eye, MapPin, Package, Plus, Search, Store, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Checkbox from '../components/Input/Checkbox';
import InputNumber from '../components/Input/InputNumber';
import InputPassword from '../components/Input/InputPassword';
import InputText from '../components/Input/InputText';
import SelectBox from '../components/Input/SelectBox';
import TextArea from '../components/Input/TextArea';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import ConfirmModal from '../components/UI/ConfirmModal';
import Modal from '../components/UI/Modal';
import { useMerchantStore } from '../store/useMerchantStore';
import { Merchant } from '../types';
import { districtOptions } from '../utils/options';

const AgentsPage: React.FC = () => {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<boolean | 'all'>('all');
    const [filterDistrict, setFilterDistrict] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState<Merchant | null>(null);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { merchants, merchantStatistics, fetchMerchants, fetchMerchantStatistics, createMerchant, updateMerchant, deleteMerchant } =
        useMerchantStore();

    const {
        register,
        handleSubmit,
        reset,
        getValues,
        formState: { errors },
    } = useForm<Merchant>({});

    useEffect(() => {
        fetchMerchants();
        fetchMerchantStatistics();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!showAddModal) {
            reset({});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showAddModal]);

    const onSubmit = async (data: Merchant) => {
        if (getValues('id')) {
            try {
                await updateMerchant(data.id, data);
                fetchMerchants();
                setShowAddModal(false);
                reset({});
                toast.success('Berhasil memperbarui agen');
            } catch (error) {
                console.error('Failed to update agent:', error);
                toast.error('Gagal memperbarui agen');
            }
        } else {
            try {
                await createMerchant(data);
                fetchMerchants();
                setShowAddModal(false);
                toast.success('Berhasil menambahkan agen');
                reset({});
            } catch (error) {
                console.error('Failed to add new agent:', error);
                toast.error('Gagal menambahkan agen');
            }
        }
    };

    const filteredAgents = merchants.filter((agent) => {
        const matchesSearch =
            agent.name.toLowerCase().includes(searchTerm.toLowerCase()) || agent.address.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || agent.status === filterStatus;
        const matchesDistrict = filterDistrict === 'all' || agent.district === filterDistrict;

        return matchesSearch && matchesStatus && matchesDistrict;
    });

    const getStatusColor = (status: boolean) => {
        switch (status) {
            case true:
                return 'bg-green-100 text-green-800';
            case false:
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStockStatus = (current: number, capacity: number) => {
        const percentage = (current / capacity) * 100;
        if (percentage <= 20) return { color: 'bg-red-500', text: 'Stok Rendah' };
        if (percentage <= 50) return { color: 'bg-yellow-500', text: 'Stok Sedang' };
        return { color: 'bg-green-500', text: 'Stok Cukup' };
    };

    const handleViewDetails = (agent: Merchant) => {
        navigate(`/agents/${agent.id}`);
    };

    const handleEditAgent = (agent: Merchant) => {
        reset(agent);
        setShowAddModal(true);
    };

    const handleViewMap = () => {
        navigate('/map');
    };

    const merchantStat = merchantStatistics || { activeMerchant: 0, totalCapacity: 0, totalMerchant: 0 };

    const openDeleteConfirmation = (agent: Merchant) => {
        setSelectedAgent(agent);
        setShowConfirmDelete(true);
    };

    const onDeleteMerchant = async () => {
        if (!selectedAgent) return;
        setIsLoading(true);
        try {
            await deleteMerchant(selectedAgent.id);
            toast.success('Agen berhasil dihapus');
            fetchMerchants();
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error('Gagal menghapus agen');
        } finally {
            setIsLoading(false);
            setShowConfirmDelete(false);
            setSelectedAgent(null);
        }
    };

    return (
        <div className='space-y-6'>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'
            >
                <div>
                    <h1 className='text-3xl font-bold text-gray-800'>Agen & Kios</h1>
                    <p className='text-gray-600 mt-1'>Kelola data agen dan kios penyalur subsidi</p>
                </div>
                <div className='flex gap-3'>
                    <Button variant='secondary' onClick={handleViewMap}>
                        <MapPin className='w-4 h-4 mr-2' />
                        Lihat Peta
                    </Button>
                    <Button variant='primary' onClick={() => setShowAddModal(true)}>
                        <Plus className='w-4 h-4 mr-2' />
                        Tambah Agen
                    </Button>
                </div>
            </motion.div>

            {/* Summary Cards */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                    <Card className='p-6'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-sm text-gray-600'>Total Agen</p>
                                <p className='text-2xl font-bold text-gray-800'>{merchantStat.totalMerchant.toLocaleString('id-ID')}</p>
                            </div>
                            <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center'>
                                <Store className='w-6 h-6 text-blue-600' />
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                    <Card className='p-6'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-sm text-gray-600'>Agen Aktif</p>
                                <p className='text-2xl font-bold text-green-600'>{merchantStat.activeMerchant}</p>
                            </div>
                            <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center'>
                                <Package className='w-6 h-6 text-green-600' />
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                    <Card className='p-6'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-sm text-gray-600'>Stok Rendah</p>
                                <p className='text-2xl font-bold text-red-600'>{merchantStat.totalCapacity}</p>
                            </div>
                            <div className='w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center'>
                                <AlertCircle className='w-6 h-6 text-red-600' />
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                    <Card className='p-6'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-sm text-gray-600'>Kapasitas Total</p>
                                <p className='text-2xl font-bold text-purple-600'>{merchantStat.totalCapacity.toLocaleString('id-ID')}</p>
                            </div>
                            <div className='w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center'>
                                <Package className='w-6 h-6 text-purple-600' />
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Filters */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
                <Card className='p-6'>
                    <div className='flex flex-col lg:flex-row gap-4'>
                        <div className='flex-1 relative'>
                            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                            <input
                                type='text'
                                placeholder='Cari berdasarkan nama atau alamat...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                            />
                        </div>
                        <div className='flex gap-3'>
                            <div className='relative'>
                                <select
                                    value={String(filterStatus)}
                                    onChange={(e) => setFilterStatus(e.target.value === 'all' ? 'all' : e.target.value === 'true' ? true : false)}
                                    className='appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white'
                                >
                                    <option value='all'>Semua Status</option>
                                    <option value='true'>Aktif</option>
                                    <option value='false'>Tidak Aktif</option>
                                </select>
                                <ChevronDown className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none' />
                            </div>
                            <div className='relative'>
                                <select
                                    value={filterDistrict}
                                    onChange={(e) => setFilterDistrict(e.target.value)}
                                    className='appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white'
                                >
                                    <option value='all'>Semua Kecamatan</option>
                                    <option value='Bantul'>Bantul</option>
                                    <option value='Sleman'>Sleman</option>
                                    <option value='Kulon Progo'>Kulon Progo</option>
                                    <option value='Gunung Kidul'>Gunung Kidul</option>
                                    <option value='Yogyakarta'>Yogyakarta</option>
                                </select>
                                <ChevronDown className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none' />
                            </div>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Agents Table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
                <Card className='overflow-hidden'>
                    <div className='overflow-x-auto'>
                        <table className='w-full'>
                            <thead className='bg-gray-50'>
                                <tr>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Agen</th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Alamat</th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Kecamatan</th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Status</th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Stok</th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Kapasitas</th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Aksi</th>
                                </tr>
                            </thead>
                            <tbody className='bg-white divide-y divide-gray-200'>
                                {filteredAgents.map((agent) => {
                                    const groupedProducts = _(agent.products)
                                        .groupBy((p) => p.product.name)
                                        .map((group) => {
                                            return {
                                                product: group[0].product, // keep product info
                                                stock: _.sumBy(group, (p) => p.stock), // sum stock
                                            };
                                        })
                                        .value();

                                    return (
                                        <motion.tr
                                            key={agent.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                            className='hover:bg-gray-50 transition-colors'
                                        >
                                            <td className='px-6 py-4 whitespace-nowrap'>
                                                <div className='flex items-center'>
                                                    <div className='w-10 h-10 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center'>
                                                        <Store className='w-5 h-5 text-white' />
                                                    </div>
                                                    <div className='ml-4'>
                                                        <div className='text-sm font-medium text-gray-900'>{agent.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{agent.address}</td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{agent.district}</td>
                                            <td className='px-6 py-4 whitespace-nowrap'>
                                                <span
                                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                                                        agent.status
                                                    )}`}
                                                >
                                                    {agent.status ? 'Aktif' : 'Tidak Aktif'}
                                                </span>
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap'>
                                                {groupedProducts.map((product) => (
                                                    <div key={product.product.name} className='flex items-center gap-2'>
                                                        <div
                                                            className={`w-2 h-2 rounded-full mr-2 ${
                                                                getStockStatus(product.stock, Number(agent.maxCapacity)).color
                                                            }`}
                                                        />
                                                        <span className='text-sm text-gray-900'>
                                                            {product.product.name}: {product.stock.toLocaleString('id-ID')} {product.product.unit}
                                                            <br />
                                                        </span>
                                                    </div>
                                                ))}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{agent.maxCapacity}</td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                                                <div className='flex space-x-2'>
                                                    <button
                                                        onClick={() => handleViewDetails(agent)}
                                                        className='text-blue-600 hover:text-blue-800'
                                                        title='Lihat Detail'
                                                    >
                                                        <Eye className='w-4 h-4' />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditAgent(agent)}
                                                        className='text-green-600 hover:text-green-800'
                                                        title='Edit Data'
                                                    >
                                                        <Edit className='w-4 h-4' />
                                                    </button>
                                                    <button
                                                        onClick={handleViewMap}
                                                        className='text-purple-600 hover:text-purple-800'
                                                        title='Lihat di Peta'
                                                    >
                                                        <MapPin className='w-4 h-4' />
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteConfirmation(agent)}
                                                        className='text-red-600 hover:text-red-800'
                                                        title='Hapus Agen'
                                                    >
                                                        <Trash2 className='w-4 h-4' />
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
                    reset({});
                }}
                title={selectedAgent ? 'Edit Agen' : 'Tambah Agen Baru'}
                size='lg'
            >
                <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
                    <InputText
                        label='Nama Agen'
                        name='name'
                        register={register}
                        placeholder='Masukkan nama agen'
                        rules={{ required: 'Nama agen wajib diisi' }}
                        error={errors.name?.message}
                    />

                    <InputText
                        label='Nama Pemilik'
                        name='ownerName'
                        register={register}
                        placeholder='Masukkan nama pemilik'
                        rules={{ required: 'Nama pemilik wajib diisi' }}
                        error={errors.ownerName?.message}
                    />

                    <InputText
                        label='NIK'
                        name='nik'
                        description='NIK harus terdiri dari 16 digit'
                        register={register}
                        placeholder='Masukkan NIK'
                        rules={{
                            required: 'NIK wajib diisi',
                            minLength: {
                                value: 16,
                                message: 'NIK harus terdiri dari 16 digit',
                            },
                            maxLength: {
                                value: 16,
                                message: 'NIK harus terdiri dari 16 digit',
                            },
                        }}
                        error={errors.nik?.message}
                    />

                    <InputText
                        label='Nomor Handphone'
                        name='phone'
                        register={register}
                        placeholder='Masukkan nomor handphone'
                        rules={{ required: 'Nomor handphone wajib diisi' }}
                        error={errors.phone?.message}
                    />

                    <SelectBox
                        label='Kecamatan'
                        name='district'
                        register={register}
                        options={districtOptions}
                        rules={{ required: 'Kecamatan harus dipilih' }}
                        error={errors.district?.message}
                    />

                    <TextArea
                        label='Alamat Lengkap'
                        name='address'
                        register={register}
                        placeholder='Masukkan alamat lengkap'
                        rules={{ required: 'Alamat wajib diisi' }}
                        error={errors.address?.message}
                    />

                    <div className='grid grid-cols-2 gap-4'>
                        <InputText
                            label='Latitude'
                            name='lat'
                            type='number'
                            register={register}
                            rules={{
                                required: 'Latitude wajib diisi',
                                valueAsNumber: true,
                                min: { value: -90, message: 'Latitude minimal -90' },
                                max: { value: 90, message: 'Latitude maksimal 90' },
                            }}
                            error={errors.lat?.message}
                        />

                        <InputText
                            type='number'
                            label='Longitude'
                            name='lng'
                            step='any'
                            register={register}
                            placeholder='Contoh: 110.3261904'
                            onWheel={(e) => e.currentTarget.blur()}
                            rules={{
                                required: 'Longitude wajib diisi',
                                valueAsNumber: true,
                                min: { value: -180, message: 'Longitude minimal -180' },
                                max: { value: 180, message: 'Longitude maksimal 180' },
                            }}
                            error={errors.lng?.message}
                        />
                    </div>

                    <InputNumber
                        label='Kapasitas Maksimum'
                        name='maxCapacity'
                        register={register}
                        placeholder='Masukkan kapasitas maksimum'
                        error={errors.maxCapacity?.message}
                        rules={{ required: 'Kapasitas wajib diisi' }}
                    />

                    <InputPassword
                        label='Password'
                        name='password'
                        register={register}
                        placeholder='Masukkan password'
                        error={errors.password?.message}
                        rules={{ required: getValues('id') ? false : 'Password wajib diisi' }}
                    />

                    <Checkbox label='Aktif' name='status' register={register} />

                    <div className='flex justify-end space-x-3 pt-4'>
                        <Button
                            variant='secondary'
                            onClick={() => {
                                setShowAddModal(false);
                                setSelectedAgent(null);
                            }}
                        >
                            Batal
                        </Button>
                        <Button type='submit' variant='primary'>
                            {selectedAgent ? 'Simpan Perubahan' : 'Simpan'}
                        </Button>
                    </div>
                </form>
            </Modal>

            <ConfirmModal
                isOpen={showConfirmDelete}
                title='Hapus Agen'
                message={`Apakah kamu yakin ingin menghapus agen "${selectedAgent?.name}"? Tindakan ini tidak bisa dibatalkan.`}
                confirmText='Ya, Hapus'
                cancelText='Batal'
                onClose={() => {
                    setShowConfirmDelete(false);
                    setSelectedAgent(null);
                }}
                onConfirm={onDeleteMerchant}
                loading={isLoading}
            />
        </div>
    );
};

export default AgentsPage;
