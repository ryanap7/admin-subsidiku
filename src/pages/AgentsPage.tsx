import { motion } from 'framer-motion';
import _ from 'lodash';
import { Edit, Eye, MapPin, Plus, Store, Trash2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PrimaryButton from '../components/Buttons/PrimaryButton';
import SecondaryButton from '../components/Buttons/SecondaryButton';
import SearchInput from '../components/Input/SearchInput';
import MerchantForm from '../components/Modules/Merchant/MerchantForm';
import MerchantSummary from '../components/Modules/Merchant/MerchantSummary';
import FilterSelection from '../components/Select/FilterSelection';
import Card from '../components/UI/Card';
import ConfirmModal from '../components/UI/ConfirmModal';
import PageHeader from '../components/UI/PageHeader';
import { useMerchantStore } from '../store/useMerchantStore';
import { Merchant } from '../types';
import { formatCurrency, getStatusColor, getStockStatus } from '../utils';
import { booleanStatusOptions, districtOptions } from '../utils/options';

const AgentsPage: React.FC = () => {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<boolean | 'all'>('all');
    const [filterDistrict, setFilterDistrict] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedAgent, setSelectedAgent] = useState<Merchant | null>(null);
    const [showConfirmDelete, setShowConfirmDelete] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { merchants, fetchMerchants, createMerchant, updateMerchant, deleteMerchant, getMerchant, addMerchantProduct } = useMerchantStore();

    const form = useForm<Merchant>({
        defaultValues: {
            products: [{ productId: '', quantity: 0 }],
        },
    });
    const { handleSubmit, reset, getValues } = form;

    useEffect(() => {
        fetchMerchants();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!showAddModal) {
            reset({});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [showAddModal]);

    const getMerchantDetail = async (id: string) => {
        try {
            const response = await getMerchant(id as string);

            reset({
                ...response,
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                products: [{ productId: '', quantity: 0 }],
            });
            setShowAddModal(true);
        } catch (error) {
            console.error('Failed to fetch agent:', error);
        }
    };

    const onSubmit = async (data: Merchant) => {
        const isEdit = Boolean(getValues('id'));
        const products = data.products.filter((p) => p.productId !== '');

        if (products.length > 0 && _.map(products, 'quantity').includes(0)) {
            toast.error('Jumlah produk tidak boleh kosong');
            return;
        }

        try {
            const payload = _.omit(data, ['products', 'createdAt', 'updatedAt', 'code']);

            if (isEdit) {
                await updateMerchant(data.id, payload as Merchant);
                await addMerchantProduct(data.id, products);
            } else {
                const response = await createMerchant(payload as Merchant);

                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                await addMerchantProduct(response.id, products);
            }

            fetchMerchants();
            setShowAddModal(false);
            reset({});
            toast.success(`Berhasil ${isEdit ? 'memperbarui' : 'menambahkan'} agen`);
        } catch (error) {
            console.error(`${isEdit ? 'Update' : 'Create'} agent failed:`, error);
            toast.error(`Gagal ${isEdit ? 'memperbarui' : 'menambahkan'} agen`);
        }
    };

    const filteredAgents = merchants.filter((agent) => {
        const matchesSearch =
            agent.name.toLowerCase().includes(searchTerm.toLowerCase()) || agent.address.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || agent.status === filterStatus;
        const matchesDistrict = filterDistrict === 'all' || agent.district === filterDistrict;

        return matchesSearch && matchesStatus && matchesDistrict;
    });

    const handleViewDetails = (agent: Merchant) => {
        navigate(`/agents/${agent.id}`);
    };

    const handleViewMap = () => {
        navigate('/map');
    };

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
            setShowConfirmDelete(false);
            setSelectedAgent(null);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error('Gagal menghapus agen');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='space-y-6'>
            {/* Header */}
            <PageHeader title='Agen' description='Kelola data agen dan kios penyalur subsidi'>
                <div className='flex gap-3'>
                    <SecondaryButton Icon={MapPin} onClick={handleViewMap}>
                        Lihat Peta
                    </SecondaryButton>
                    <PrimaryButton Icon={Plus} onClick={() => setShowAddModal(true)}>
                        Tambah Agen
                    </PrimaryButton>
                </div>
            </PageHeader>

            {/* Summary Cards */}
            <MerchantSummary />

            {/* Filters */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
                <Card className='p-6'>
                    <div className='flex flex-col lg:flex-row gap-4'>
                        <SearchInput
                            placeholder='Cari berdasarkan nama atau alamat...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <div className='flex gap-3'>
                            <FilterSelection
                                options={[{ value: 'all', label: 'Semua Status' }, ...booleanStatusOptions]}
                                value={String(filterStatus)}
                                onChange={(e) => setFilterStatus(e.target.value === 'all' ? 'all' : e.target.value === 'true' ? true : false)}
                            />
                            <FilterSelection
                                options={[{ value: 'all', label: 'Semua Kecamatan' }, ...districtOptions]}
                                value={filterDistrict}
                                onChange={(e) => setFilterDistrict(e.target.value)}
                            />
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
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Saldo</th>
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
                                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                                                {formatCurrency(Number(agent.balance) || 0)}
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
                                                        onClick={() => getMerchantDetail(agent.id)}
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
            <MerchantForm
                isOpen={showAddModal}
                onClose={() => {
                    setShowAddModal(false);
                    setSelectedAgent(null);
                    reset({});
                }}
                form={form}
                onSubmit={handleSubmit(onSubmit)}
                onCancel={() => {
                    setShowAddModal(false);
                    setSelectedAgent(null);
                }}
                isEdit={getValues('id') ? true : false}
            />

            <ConfirmModal
                isOpen={showConfirmDelete}
                title='Hapus Agen'
                message={`Apakah Anda yakin ingin menghapus agen "${selectedAgent?.name}"? Tindakan ini tidak bisa dibatalkan.`}
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
