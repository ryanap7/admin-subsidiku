import { motion } from 'framer-motion';
import _ from 'lodash';
import { ArrowLeft, BarChart3, Edit, FileText, MapPin, Navigation, Package, Plus, TrendingUp, Truck } from 'lucide-react';
import moment from 'moment';
import React, { useEffect, useReducer, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Checkbox from '../components/Input/Checkbox';
import InputNumber from '../components/Input/InputNumber';
import InputPassword from '../components/Input/InputPassword';
import InputText from '../components/Input/InputText';
import SelectBox from '../components/Select/SelectBox';
import TextArea from '../components/Input/TextArea';
import AddStockModal from '../components/Modules/Merchant/AddStockModal';
import UpdateLocationModal from '../components/Modules/Merchant/UpdateLocationModal';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import GoogleMap from '../components/UI/GoogleMap';
import Modal from '../components/UI/Modal';
import { useMerchantStore } from '../store/useMerchantStore';
import { useProductStore } from '../store/useProductStore';
import { Merchant, MerchantProduct } from '../types';
import { actionCreators, globalReducer, initialState } from '../utils/globalReducer';
import { districtOptions } from '../utils/options';
import { StockType } from '../utils/enums';

const AgentDetailPage: React.FC = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const [showMapModal, setShowMapModal] = useState(false);
    const [showStockHistoryModal, setShowStockHistoryModal] = useState(false);
    const [showDeliveryModal, setShowDeliveryModal] = useState(false);
    const [showReportModal, setShowReportModal] = useState(false);
    const [agent, setAgent] = useState<Merchant | null>(null);

    const [state, dispatch] = useReducer(globalReducer, initialState);

    const { getMerchant, updateMerchant, addMerchantProduct } = useMerchantStore();
    const { fetchProducts } = useProductStore();

    const {
        register,
        handleSubmit,
        reset,
        getValues,
        formState: { errors },
    } = useForm<Merchant>({});

    useEffect(() => {
        if (!id) return;
        fetchProducts();
        getAgent();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const getAgent = async () => {
        try {
            const response = await getMerchant(id as string);

            setAgent(response);
        } catch (error) {
            console.error('Failed to fetch agent:', error);
        }
    };

    const onUpdateMerchant = async (data: Merchant) => {
        dispatch(actionCreators.setLoading(true));
        const dataType = state.modalType === 'updateMerchant' ? 'agen' : state.modalType === 'updateLocation' ? 'lokasi' : 'data';

        try {
            await updateMerchant(agent?.id as string, data);
            getAgent();
            toast.success(`Berhasil memperbarui agen ${dataType}`);
            reset({});
            handleModalChange('', null);
        } catch (error) {
            console.error('Failed to update agent:', error);
            toast.error(`Gagal memperbarui ${dataType}`);
        } finally {
            dispatch(actionCreators.setLoading(false));
        }
    };

    const onAddStock = async (data: MerchantProduct) => {
        dispatch(actionCreators.setLoading(true));
        try {
            await addMerchantProduct(agent?.id as string, [data]);
            getAgent();
            toast.success('Berhasil menambah stok');
            handleModalChange('', null);
        } catch (error) {
            console.error('Failed to update agent:', error);
            toast.error('Gagal menambah stok');
        } finally {
            dispatch(actionCreators.setLoading(false));
        }
    };

    const stockHistory = agent?.stockCards;
 
    const deliverySchedule = [
        {
            id: '1',
            date: '2024-01-20',
            product: 'Pupuk',
            quantity: 500,
            status: 'scheduled',
            supplier: 'PT Pupuk Indonesia',
        },
        {
            id: '2',
            date: '2024-01-25',
            product: 'LPG',
            quantity: 100,
            status: 'confirmed',
            supplier: 'PT Pertamina',
        },
        {
            id: '3',
            date: '2024-02-01',
            product: 'Pupuk',
            quantity: 300,
            status: 'pending',
            supplier: 'PT Pupuk Indonesia',
        },
    ];

    const recentTransactions = agent?.transactions?.slice(0, 5) || [];

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
        if (percentage <= 20)
            return {
                color: 'bg-red-500',
                text: 'Stok Rendah',
                textColor: 'text-red-600',
            };
        if (percentage <= 50)
            return {
                color: 'bg-yellow-500',
                text: 'Stok Sedang',
                textColor: 'text-yellow-600',
            };
        return {
            color: 'bg-green-500',
            text: 'Stok Cukup',
            textColor: 'text-green-600',
        };
    };

    const getDeliveryStatusColor = (status: string) => {
        switch (status) {
            case 'confirmed':
                return 'bg-green-100 text-green-800';
            case 'scheduled':
                return 'bg-blue-100 text-blue-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    }; 

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(amount);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const handleModalChange = (type: string, data: Merchant | null) => {
        if (type === '') {
            dispatch(actionCreators.closeModal());
        } else {
            dispatch(actionCreators.openModal(type, data));
        }
    };

    const totalStock = _.sum(_.map(agent?.products, 'stock')) || 0;
    const maxCapacity = agent?.maxCapacity || 0;
    const stockStatus = getStockStatus(totalStock, maxCapacity);
    const utilizationPercentage = (totalStock / maxCapacity) * 100;

    const todaysTransactions = recentTransactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        const today = new Date();

        return (
            transactionDate.getDate() === today.getDate() &&
            transactionDate.getMonth() === today.getMonth() &&
            transactionDate.getFullYear() === today.getFullYear()
        );
    }).length;

    const yesterdaysTransactions = recentTransactions.filter((transaction) => {
        const transactionDate = new Date(transaction.date);
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);

        return (
            transactionDate.getDate() === yesterday.getDate() &&
            transactionDate.getMonth() === yesterday.getMonth() &&
            transactionDate.getFullYear() === yesterday.getFullYear()
        );
    }).length;

    const transactionIncreasePercentage = ((todaysTransactions - yesterdaysTransactions) / yesterdaysTransactions) * 100 || 0;

    const sortedStockHistory = [...(stockHistory ?? [])].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return (
        <div className='space-y-6'>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='flex items-center justify-between'
            >
                <div className='flex items-center space-x-4'>
                    <Button variant='secondary' onClick={() => navigate('/agents')}>
                        <ArrowLeft className='w-4 h-4 mr-2' />
                        Kembali
                    </Button>
                    <div>
                        <h1 className='text-3xl font-bold text-gray-800'>{agent?.name}</h1>
                        <p className='text-gray-600 mt-1'>Detail Agen & Kios</p>
                    </div>
                </div>
                <div className='flex gap-3'>
                    <Button variant='secondary' onClick={() => setShowMapModal(true)}>
                        <MapPin className='w-4 h-4 mr-2' />
                        Lihat Peta
                    </Button>
                    <Button
                        variant='secondary'
                        onClick={() => {
                            reset(agent as Merchant);
                            handleModalChange('updateMerchant', agent);
                        }}
                    >
                        <Edit className='w-4 h-4 mr-2' />
                        Edit Data
                    </Button>
                </div>
            </motion.div>

            {/* Summary Cards */}
            <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                    <Card className='p-6'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-sm text-gray-600'>Stok Saat Ini</p>
                                <p className='text-2xl font-bold text-gray-800'>{totalStock.toLocaleString('id')}</p>
                                <p className={`text-xs font-medium ${stockStatus.textColor}`}>{stockStatus.text}</p>
                            </div>
                            <div className='w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center'>
                                <Package className='w-6 h-6 text-blue-600' />
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
                    <Card className='p-6'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-sm text-gray-600'>Kapasitas</p>
                                <p className='text-2xl font-bold text-gray-800'>{maxCapacity.toLocaleString('id')}</p>
                                <p className='text-xs text-gray-500'>Maksimum</p>
                            </div>
                            <div className='w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center'>
                                <Package className='w-6 h-6 text-purple-600' />
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
                    <Card className='p-6'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-sm text-gray-600'>Utilisasi</p>
                                <p className='text-2xl font-bold text-gray-800'>{Math.round(utilizationPercentage).toLocaleString('id')}%</p>
                                <p className='text-xs text-gray-500'>Dari kapasitas</p>
                            </div>
                            <div className='w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center'>
                                <TrendingUp className='w-6 h-6 text-green-600' />
                            </div>
                        </div>
                    </Card>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}>
                    <Card className='p-6'>
                        <div className='flex items-center justify-between'>
                            <div>
                                <p className='text-sm text-gray-600'>Transaksi Hari Ini</p>
                                <p className='text-2xl font-bold text-gray-800'>{todaysTransactions}</p>
                                <p className='text-xs text-green-600'>
                                    {transactionIncreasePercentage > 0 ? '+' : ''}
                                    {transactionIncreasePercentage >= 0 ? transactionIncreasePercentage.toFixed(2) : 0} % dari kemarin
                                </p>
                            </div>
                            <div className='w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center'>
                                <FileText className='w-6 h-6 text-orange-600' />
                            </div>
                        </div>
                    </Card>
                </motion.div>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    className='lg:col-span-2 space-y-6'
                >
                    {/* Agent Information */}
                    <Card className='p-6'>
                        <h2 className='text-xl font-semibold text-gray-800 mb-6'>Informasi Agen</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div className='space-y-4'>
                                <div>
                                    <p className='text-sm text-gray-600'>Nama Agen</p>
                                    <p className='font-medium text-lg'>{agent?.name}</p>
                                </div>
                                <div>
                                    <p className='text-sm text-gray-600'>Alamat</p>
                                    <p className='font-medium'>{agent?.address}</p>
                                </div>
                                <div>
                                    <p className='text-sm text-gray-600'>Kecamatan</p>
                                    <p className='font-medium'>{agent?.district}</p>
                                </div>
                            </div>
                            <div className='space-y-4'>
                                <div>
                                    <p className='text-sm text-gray-600'>Koordinat GPS</p>
                                    <p className='font-medium'>
                                        {agent?.lat}, {agent?.lng}
                                    </p>
                                </div>
                                <div>
                                    <p className='text-sm text-gray-600'>Status</p>
                                    <span
                                        className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                                            agent?.status ?? false
                                        )}`}
                                    >
                                        {agent?.status ? 'Aktif' : 'Tidak Aktif'}
                                    </span>
                                </div>
                                <div>
                                    <p className='text-sm text-gray-600'>Utilisasi Stok</p>
                                    <div className='w-full bg-gray-200 rounded-full h-3 mt-2'>
                                        <div className={`h-3 rounded-full ${stockStatus.color}`} style={{ width: `${utilizationPercentage}%` }}></div>
                                    </div>
                                    <p className='text-xs text-gray-500 mt-1'>{Math.round(utilizationPercentage)}% terisi</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Recent Transactions */}
                    <Card className='p-6'>
                        <div className='flex items-center justify-between mb-6'>
                            <h2 className='text-xl font-semibold text-gray-800'>Transaksi Terbaru</h2>
                            <Button variant='secondary' size='sm'>
                                <FileText className='w-4 h-4 mr-2' />
                                Lihat Semua
                            </Button>
                        </div>
                        <div className='overflow-x-auto'>
                            <table className='w-full'>
                                <thead className='bg-gray-50'>
                                    <tr>
                                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>ID</th>
                                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Tanggal</th>
                                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Penerima</th>
                                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Produk</th>
                                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Jumlah</th>
                                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Total</th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-gray-200'>
                                    {recentTransactions?.map((transaction) => (
                                        <tr key={transaction.id} className='hover:bg-gray-50'>
                                            <td className='px-4 py-3 text-sm font-medium text-gray-900'>{transaction.id}</td>
                                            <td className='px-4 py-3 text-sm text-gray-900'>{formatDate(transaction.date)}</td>
                                            <td className='px-4 py-3 text-sm text-gray-900'>{transaction.metadataRecipient?.name}</td>
                                            <td className='px-4 py-3 text-sm text-gray-900 capitalize'>{transaction.metadataProduct?.name}</td>
                                            <td className='px-4 py-3 text-sm text-gray-900'>
                                                {transaction.qty} {transaction.metadataProduct?.name}
                                            </td>
                                            <td className='px-4 py-3 text-sm font-medium text-gray-900'>{formatCurrency(transaction.totalAmount)}</td>
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
                    className='space-y-6'
                >
                    {/* Stock Management */}
                    <Card className='p-6'>
                        <h3 className='text-lg font-semibold text-gray-800 mb-4'>Manajemen Stok</h3>
                        <div className='space-y-4'>
                            <div className='text-center'>
                                <div className='text-3xl font-bold text-gray-800'>{totalStock.toLocaleString('id-ID')}</div>
                                <div className='text-sm text-gray-600'>dari {agent?.maxCapacity?.toLocaleString('id-ID')} kapasitas</div>
                            </div>
                            <div className='space-y-2'>
                                <Button variant='primary' size='sm' className='w-full' onClick={() => handleModalChange('addStock', null)}>
                                    <Package className='w-4 h-4 mr-2' />
                                    Tambah Stok
                                </Button>
                                <Button variant='secondary' size='sm' className='w-full' onClick={() => setShowStockHistoryModal(true)}>
                                    <TrendingUp className='w-4 h-4 mr-2' />
                                    Riwayat Stok
                                </Button>
                            </div>
                        </div>
                    </Card>

                    {/* Stock History Preview */}
                    <Card className='p-6'>
                        <h3 className='text-lg font-semibold text-gray-800 mb-4'>Riwayat Stok Terbaru</h3>
                        <div className='space-y-3'>
                            {sortedStockHistory.slice(0, 3).map((entry, index) => {
                                const prevQty = sortedStockHistory[index + 1]?.qty ?? entry.qty;
                                const diff = entry.qty - prevQty;

                                return (
                                    <div key={index} className='flex items-center justify-between p-3 bg-gray-50 rounded-xl'>
                                        <div>
                                            <p className='text-sm font-medium text-gray-800'>{entry.qty.toLocaleString('id')}</p>
                                            <p className='text-xs text-gray-500'>{moment(entry.createdAt).format('DD MMMM YYYY HH:mm')}</p>
                                        </div>
                                        <div className={`text-sm font-medium ${entry.type === StockType.IN ? 'text-green-600' : 'text-red-600'}`}>
                                            {diff >= 0 ? '+' : ''}
                                            {Math.abs(diff).toLocaleString('id')}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>

                    {/* Quick Actions */}
                    <Card className='p-6'>
                        <h3 className='text-lg font-semibold text-gray-800 mb-4'>Aksi Cepat</h3>
                        <div className='space-y-2'>
                            <Button variant='secondary' size='sm' className='w-full' onClick={() => setShowDeliveryModal(true)}>
                                <Truck className='w-4 h-4 mr-2' />
                                Jadwal Pengiriman
                            </Button>
                            <Button variant='secondary' size='sm' className='w-full' onClick={() => setShowReportModal(true)}>
                                <BarChart3 className='w-4 h-4 mr-2' />
                                Laporan Bulanan
                            </Button>
                            <Button variant='secondary' size='sm' className='w-full' onClick={() => handleModalChange('updateLocation', agent)}>
                                <Navigation className='w-4 h-4 mr-2' />
                                Update Lokasi
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Edit Modal */}
            <Modal
                isOpen={state.modalType === 'updateMerchant' && state.openModal}
                onClose={() => dispatch(actionCreators.openModal('', null))}
                title='Edit Data Agen'
                size='lg'
            >
                <form className='space-y-4' onSubmit={handleSubmit(onUpdateMerchant)}>
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

                    <div className='grid grid-cols-2 gap-4'>
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
                    </div>

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
                                dispatch(actionCreators.openModal('', null));
                                reset({});
                            }}
                        >
                            Batal
                        </Button>
                        <Button type='submit' variant='primary'>
                            {state.loading ? 'Memproses...' : 'Simpan Perubahan'}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Map Modal */}
            <Modal isOpen={showMapModal} onClose={() => setShowMapModal(false)} title='Lokasi Agen' size='xl'>
                <div className='space-y-4'>
                    <GoogleMap
                        center={{ lat: Number(agent?.lat), lng: Number(agent?.lng) }}
                        zoom={15}
                        markers={[
                            {
                                position: { lat: Number(agent?.lat), lng: Number(agent?.lng) },
                                title: agent?.name as string,
                                info: agent?.address,
                            },
                        ]}
                        height='400px'
                    />
                    <div className='p-4 bg-blue-50 rounded-xl'>
                        <h4 className='font-medium text-blue-800 mb-2'>{agent?.name}</h4>
                        <p className='text-sm text-blue-700'>{agent?.address}</p>
                        <div className='mt-3 flex gap-2'>
                            <Button variant='secondary' size='sm'>
                                <MapPin className='w-4 h-4 mr-2' />
                                Buka di Google Maps
                            </Button>
                            <Button variant='secondary' size='sm'>
                                Dapatkan Arah
                            </Button>
                        </div>
                    </div>
                </div>
            </Modal>

            {/* Stock Modal */}
            <AddStockModal
                isOpen={state.modalType === 'addStock' && state.openModal}
                onClose={() => handleModalChange('', null)}
                onSubmit={onAddStock}
            />

            {/* Stock History Modal */}
            <Modal isOpen={showStockHistoryModal} onClose={() => setShowStockHistoryModal(false)} title='Riwayat Stok' size='lg'>
                <div className='space-y-4'>
                    <div className='flex justify-between items-center'>
                        <p className='text-sm text-gray-600'>Riwayat perubahan stok 30 hari terakhir</p>
                        <Button variant='secondary' size='sm'>
                            <FileText className='w-4 h-4 mr-2' />
                            Export
                        </Button>
                    </div>
                    <div className='max-h-96 overflow-y-auto'>
                        <table className='w-full'>
                            <thead className='bg-gray-50 sticky top-0'>
                                <tr>
                                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Tanggal</th>
                                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Stok</th>
                                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Perubahan</th>
                                    <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Keterangan</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-200'>
                                {sortedStockHistory?.map((entry, index) => {
                                    const prevQty = sortedStockHistory[index + 1]?.qty ?? entry.qty;
                                    const diff = entry.qty - prevQty;

                                    return (
                                        <tr key={index} className='hover:bg-gray-50'>
                                            <td className='px-4 py-3 text-sm text-gray-900'>{formatDate(entry.createdAt)}</td>
                                            <td className='px-4 py-3 text-sm font-medium text-gray-900'>{entry.qty.toLocaleString('id')}</td>
                                            <td className='px-4 py-3 text-sm'>
                                                <span className={`font-medium ${entry.type === StockType.IN ? 'text-green-600' : 'text-red-600'}`}>
                                                    {diff >= 0 ? '+' : ''}
                                                    {Math.abs(diff).toLocaleString('id')}
                                                </span>
                                            </td>
                                            <td className='px-4 py-3 text-sm text-gray-600'>{entry.note}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Modal>

            {/* Delivery Schedule Modal */}
            <Modal isOpen={showDeliveryModal} onClose={() => setShowDeliveryModal(false)} title='Jadwal Pengiriman' size='lg'>
                <div className='space-y-4'>
                    <div className='flex justify-between items-center'>
                        <p className='text-sm text-gray-600'>Jadwal pengiriman stok mendatang</p>
                        <Button variant='primary' size='sm'>
                            <Plus className='w-4 h-4 mr-2' />
                            Tambah Jadwal
                        </Button>
                    </div>
                    <div className='space-y-3'>
                        {deliverySchedule?.map((delivery) => (
                            <div key={delivery.id} className='p-4 border border-gray-200 rounded-xl'>
                                <div className='flex items-center justify-between mb-2'>
                                    <h4 className='font-medium text-gray-800'>{delivery.product}</h4>
                                    <span className={`px-2 py-1 text-xs rounded-full ${getDeliveryStatusColor(delivery.status)}`}>
                                        {delivery.status === 'confirmed'
                                            ? 'Dikonfirmasi'
                                            : delivery.status === 'scheduled'
                                            ? 'Dijadwalkan'
                                            : 'Pending'}
                                    </span>
                                </div>
                                <div className='grid grid-cols-3 gap-4 text-sm'>
                                    <div>
                                        <p className='text-gray-600'>Tanggal</p>
                                        <p className='font-medium'>{formatDate(delivery.date)}</p>
                                    </div>
                                    <div>
                                        <p className='text-gray-600'>Jumlah</p>
                                        <p className='font-medium'>
                                            {delivery.quantity} {delivery.product === 'Pupuk' ? 'kg' : 'tabung'}
                                        </p>
                                    </div>
                                    <div>
                                        <p className='text-gray-600'>Supplier</p>
                                        <p className='font-medium'>{delivery.supplier}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Modal>

            {/* Monthly Report Modal */}
            <Modal isOpen={showReportModal} onClose={() => setShowReportModal(false)} title='Laporan Bulanan' size='lg'>
                <div className='space-y-6'>
                    <div className='grid grid-cols-2 gap-4'>
                        <div className='p-4 bg-blue-50 rounded-xl'>
                            <h4 className='font-medium text-blue-800 mb-2'>Total Transaksi</h4>
                            <p className='text-2xl font-bold text-blue-900'>156</p>
                            <p className='text-sm text-blue-700'>+12% dari bulan lalu</p>
                        </div>
                        <div className='p-4 bg-green-50 rounded-xl'>
                            <h4 className='font-medium text-green-800 mb-2'>Total Penjualan</h4>
                            <p className='text-2xl font-bold text-green-900'>{formatCurrency(4500000)}</p>
                            <p className='text-sm text-green-700'>+8% dari bulan lalu</p>
                        </div>
                    </div>

                    <div className='space-y-4'>
                        <h4 className='font-medium text-gray-800'>Ringkasan Aktivitas</h4>
                        <div className='space-y-2'>
                            <div className='flex justify-between p-3 bg-gray-50 rounded-lg'>
                                <span className='text-sm text-gray-600'>Stok Masuk</span>
                                <span className='font-medium'>1,200 kg</span>
                            </div>
                            <div className='flex justify-between p-3 bg-gray-50 rounded-lg'>
                                <span className='text-sm text-gray-600'>Stok Keluar</span>
                                <span className='font-medium'>950 kg</span>
                            </div>
                            <div className='flex justify-between p-3 bg-gray-50 rounded-lg'>
                                <span className='text-sm text-gray-600'>Rata-rata Harian</span>
                                <span className='font-medium'>31 kg/hari</span>
                            </div>
                        </div>
                    </div>

                    <div className='flex justify-end space-x-3'>
                        <Button variant='secondary'>
                            <FileText className='w-4 h-4 mr-2' />
                            Download PDF
                        </Button>
                        <Button variant='primary'>
                            <FileText className='w-4 h-4 mr-2' />
                            Download Excel
                        </Button>
                    </div>
                </div>
            </Modal>

            {/* Update Location Modal */}
            <UpdateLocationModal
                isOpen={state.modalType === 'updateLocation' && state.openModal}
                onClose={() => handleModalChange('', null)}
                onSubmit={onUpdateMerchant}
                initialData={{
                    lat: agent?.lat || 0,
                    lng: agent?.lng || 0,
                    address: agent?.address || '',
                }}
            />
        </div>
    );
};

export default AgentDetailPage;
