import { motion } from 'framer-motion';
import _ from 'lodash';
import { Edit, FileText, MapPin, Plus, UserX } from 'lucide-react';
import React, { useEffect, useReducer, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import PrimaryButton from '../components/Buttons/PrimaryButton';
import SecondaryButton from '../components/Buttons/SecondaryButton';
import RecipientForm from '../components/Modules/Recipient/RecipientForm';
import SuspendModal from '../components/Modules/Recipient/SuspendModal';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import GoogleMap from '../components/UI/GoogleMap';
import Modal from '../components/UI/Modal';
import PageHeader from '../components/UI/PageHeader';
import { useMerchantStore } from '../store/useMerchantStore';
import { useProductStore } from '../store/useProductStore';
import { useRecipientStore } from '../store/useRecipientStore';
import { Recipient } from '../types';
import {
    formatCurrency,
    formatDate,
    getClassificationColor,
    getClassificationIcon,
    getClassificationLabel,
    getHomeOwnershipLabel,
    getRecipientStatusColor,
    getRecipientStatusLabel,
} from '../utils';
import { actionCreators, globalReducer, initialState } from '../utils/globalReducer';

const RecipientsDetailPage: React.FC = () => {
    const { id } = useParams();

    const [showQuotaModal, setShowQuotaModal] = useState(false);
    const [showMapModal, setShowMapModal] = useState(false);

    const [recipient, setRecipient] = useState<Recipient | null>(null);
    const { register, handleSubmit, setValue, watch, reset } = useForm<Recipient & { subsidies: string[] }>({});

    const [state, dispatch] = useReducer(globalReducer, initialState);

    const { getRecipient, updateRecipient } = useRecipientStore();
    const { products, fetchProducts } = useProductStore();
    const { merchants, fetchMerchants } = useMerchantStore();

    useEffect(() => {
        if (!id) return;
        fetchRecipient();
        fetchProducts();
        fetchMerchants();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchRecipient = async () => {
        try {
            const response = await getRecipient(id as string);
            setRecipient(response);
        } catch (error) {
            console.error('Failed to fetch recipient:', error);
            toast.error('Gagal mengambil data penerima');
        }
    };

    const onSubmit = async (data: Recipient & { subsidies: string[] }) => {
        dispatch(actionCreators.setLoading(true));
        try {
            data['haveBankAccount'] = data.haveBankAccount === 'true';

            const removedKeys = [
                'id',
                'balance',
                'avatar',
                'createdAt',
                'updatedAt',
                'merchant',
                'subsidies',
                'transactions',
                '_count',
                'merchantId',
            ];
            const payload = _.omit(data, removedKeys);

            await updateRecipient(data.id, payload as Recipient);

            toast.success('Berhasil memperbarui data');
            fetchRecipient();
            handleModalChange('', null);
            reset({});
        } catch (error) {
            console.error('Failed to update recipient:', error);
            toast.error('Gagal memperbarui data');
        } finally {
            dispatch(actionCreators.setLoading(false));
        }
    };

    const onSuspendRecipient = async (notes: string) => {
        try {
            const selectedRecipient = state.modalData as Recipient;

            const removedKeys = ['id', 'balance', 'avatar', 'createdAt', 'updatedAt', 'merchant', 'subsidies', 'transactions', '_count'];
            const payload = _.omit(selectedRecipient, removedKeys);

            await updateRecipient(selectedRecipient.id, {
                ...(payload as Recipient),
                suspensionNotes: notes,
                status: 'Ditangguhkan',
            });

            toast.success('Penerima subsidi berhasil ditangguhkan');
            fetchRecipient();
            handleModalChange('', null);
        } catch (error) {
            console.error('Failed to suspend recipient:', error);
            toast.error('Penerima subsidi gagal ditangguhkan');
        }
    };

    const handleModalChange = (type: string, data: Recipient | null) => {
        if (type === '') {
            dispatch(actionCreators.closeModal());
        } else {
            dispatch(actionCreators.openModal(type, data));
        }
    };
    const handleAddQuota = () => {
        setShowQuotaModal(true);
    };

    const handleViewMap = () => {
        setShowMapModal(true);
    };

    const ClassificationIcon = getClassificationIcon(recipient?.classification);

    const recipientCoordinates = { lat: recipient?.merchant?.lat, lng: recipient?.merchant?.lng };

    return (
        <div className='space-y-6'>
            {/* Header */}
            <PageHeader path='/recipients' title={recipient?.name} description='Detail Penerima Subsidi'>
                <div className='flex gap-3'>
                    <SecondaryButton
                        Icon={Edit}
                        onClick={() => {
                            handleModalChange('recipientForm', recipient);
                            reset({
                                ...recipient,
                                haveBankAccount: String(recipient.haveBankAccount),
                                merchantId: recipient.merchant?.id,
                                subsidies: recipient.subsidies.map((s) => s.product.id),
                            });
                        }}
                    >
                        Edit Data
                    </SecondaryButton>
                    <Button Icon={UserX} variant='danger' onClick={() => handleModalChange('suspend', recipient)}>
                        Tangguhkan
                    </Button>
                </div>
            </PageHeader>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                {/* Main Info */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className='lg:col-span-2 space-y-6'
                >
                    {/* Personal Information */}
                    <Card className='p-6'>
                        <h2 className='text-xl font-semibold text-gray-800 mb-6'>Informasi Pribadi</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div className='space-y-4'>
                                <div>
                                    <p className='text-sm text-gray-600'>NIK</p>
                                    <p className='font-medium text-lg'>{recipient?.nik}</p>
                                </div>
                                <div>
                                    <p className='text-sm text-gray-600'>Nama Lengkap</p>
                                    <p className='font-medium text-lg'>{recipient?.name}</p>
                                </div>
                                <div>
                                    <p className='text-sm text-gray-600'>Kecamatan</p>
                                    <p className='font-medium'>{recipient?.district}</p>
                                </div>
                                <div>
                                    <p className='text-sm text-gray-600'>Jumlah Anggota Keluarga</p>
                                    <p className='font-medium'>{recipient?.familiyMembers} orang</p>
                                </div>
                            </div>
                            <div className='space-y-4'>
                                <div>
                                    <p className='text-sm text-gray-600'>Alamat Lengkap</p>
                                    <p className='font-medium'>{recipient?.address}</p>
                                </div>
                                <div>
                                    <p className='text-sm text-gray-600'>Status</p>
                                    <span
                                        className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getRecipientStatusColor(
                                            recipient?.status
                                        )}`}
                                    >
                                        {getRecipientStatusLabel(recipient?.status)}
                                    </span>
                                </div>
                                <div>
                                    <p className='text-sm text-gray-600'>Jenis Subsidi</p>
                                    <p className='font-medium'>
                                        {recipient?.subsidies
                                            ?.map((subsidy) => subsidy.product?.name)
                                            .join(recipient?.subsidies?.length <= 2 ? ' & ' : ', ')}
                                    </p>
                                </div>
                                <div>
                                    <p className='text-sm text-gray-600'>Klasifikasi Ekonomi</p>
                                    <div className='flex items-center space-x-2'>
                                        <ClassificationIcon className='w-4 h-4 text-gray-400' />
                                        <span
                                            className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getClassificationColor(
                                                recipient?.classification
                                            )}`}
                                        >
                                            {getClassificationLabel(recipient?.classification)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Economic Information */}
                    <Card className='p-6'>
                        <h2 className='text-xl font-semibold text-gray-800 mb-6'>Informasi Ekonomi</h2>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div className='space-y-4'>
                                <div>
                                    <p className='text-sm text-gray-600'>Pendapatan Bulanan</p>
                                    <p className='font-medium text-lg'>{formatCurrency(Number(recipient?.income))}</p>
                                </div>
                                <div>
                                    <p className='text-sm text-gray-600'>Luas Lahan</p>
                                    <p className='font-medium'>{recipient?.landArea} Ha</p>
                                </div>
                                <div>
                                    <p className='text-sm text-gray-600'>Status Kepemilikan Rumah</p>
                                    <p className='font-medium capitalize'>{getHomeOwnershipLabel(recipient?.homeOwnership)}</p>
                                </div>
                            </div>
                            <div className='space-y-4'>
                                <div>
                                    <p className='text-sm text-gray-600'>Rekening Bank</p>
                                    <p className='font-medium'>{recipient?.haveBankAccount ? 'Ya' : 'Tidak'}</p>
                                </div>
                                <div>
                                    <p className='text-sm text-gray-600'>Nomor Kartu Jaminan Sosial</p>
                                    <p className='font-medium'>{recipient?.kjsNumber || '-'}</p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Transaction History */}
                    <Card className='p-6'>
                        <div className='flex items-center justify-between mb-6'>
                            <h2 className='text-xl font-semibold text-gray-800'>Riwayat Transaksi</h2>
                            <SecondaryButton Icon={FileText} size='sm'>
                                Export
                            </SecondaryButton>
                        </div>
                        <div className='overflow-x-auto'>
                            <table className='w-full'>
                                <thead className='bg-gray-50'>
                                    <tr>
                                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>ID</th>
                                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Tanggal</th>
                                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Produk</th>
                                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Jumlah</th>
                                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Agen</th>
                                        <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase'>Total</th>
                                    </tr>
                                </thead>
                                <tbody className='divide-y divide-gray-200'>
                                    {recipient?.transactions?.map((transaction) => (
                                        <tr key={transaction.id} className='hover:bg-gray-50'>
                                            <td className='px-4 py-3 text-sm font-medium text-gray-900'>{transaction.id}</td>
                                            <td className='px-4 py-3 text-sm text-gray-900'>{formatDate(transaction.date)}</td>
                                            <td className='px-4 py-3 text-sm text-gray-900 capitalize'>{transaction?.metadataProduct?.name}</td>
                                            <td className='px-4 py-3 text-sm text-gray-900'>
                                                {transaction.qty} {transaction?.metadataProduct?.unit}
                                            </td>
                                            <td className='px-4 py-3 text-sm text-gray-900'>{transaction.metadataRecipient?.merchant?.name}</td>
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
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className='space-y-6'
                >
                    {/* Quota Information */}
                    <Card className='p-6'>
                        <h3 className='text-lg font-semibold text-gray-800 mb-4'>Informasi Kuota</h3>
                        <div className='space-y-4'>
                            {recipient?.subsidies?.map((subsidy, index) => (
                                <div key={index} className='border-b border-dotted pb-4'>
                                    <h4 className='text-sm font-semibold text-gray-800 mb-2'>
                                        {index + 1}. {subsidy?.product?.name}
                                    </h4>
                                    <div className='flex justify-between items-center mb-2'>
                                        <span className='text-sm text-gray-600'>Kuota Bulanan</span>
                                        <span className='text-sm font-medium'>{subsidy?.monthlyQuota}</span>
                                    </div>
                                    <div className='flex justify-between items-center mb-2'>
                                        <span className='text-sm text-gray-600'>Kuota Tersisa</span>
                                        <span className='text-sm font-medium text-green-600'>{subsidy?.remainingQuota}</span>
                                    </div>
                                    <div className='w-full bg-gray-200 rounded-full h-2'>
                                        <div
                                            className='bg-green-600 h-2 rounded-full'
                                            style={{
                                                width: `${(subsidy?.remainingQuota / subsidy?.monthlyQuota) * 100}%`,
                                            }}
                                        ></div>
                                    </div>
                                    <p className='text-xs text-gray-500 mt-1'>
                                        {Math.round((subsidy?.remainingQuota / subsidy?.monthlyQuota) * 100)}% tersisa
                                    </p>
                                </div>
                            ))}
                            <PrimaryButton Icon={Plus} size='sm' className='w-full' onClick={handleAddQuota}>
                                Tambah Kuota
                            </PrimaryButton>
                        </div>
                    </Card>

                    {/* Classification Details */}
                    <Card className='p-6'>
                        <h3 className='text-lg font-semibold text-gray-800 mb-4'>Detail Klasifikasi</h3>
                        <div className='space-y-3'>
                            <div className='flex items-center justify-center p-4 bg-gray-50 rounded-xl'>
                                <div className='text-center'>
                                    <ClassificationIcon className='w-8 h-8 mx-auto mb-2 text-gray-600' />
                                    <span
                                        className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getClassificationColor(
                                            recipient?.classification
                                        )}`}
                                    >
                                        {getClassificationLabel(recipient?.classification)}
                                    </span>
                                </div>
                            </div>
                            <div className='text-sm text-gray-600'>
                                <p className='mb-2'>Kriteria klasifikasi berdasarkan:</p>
                                <ul className='space-y-1 text-xs'>
                                    <li>• Pendapatan per bulan</li>
                                    <li>• Jumlah anggota keluarga</li>
                                    <li>• Kepemilikan aset</li>
                                    <li>• Status jaminan sosial</li>
                                </ul>
                            </div>
                        </div>
                    </Card>

                    {/* Quick Stats */}
                    <Card className='p-6'>
                        <h3 className='text-lg font-semibold text-gray-800 mb-4'>Statistik</h3>
                        <div className='space-y-3'>
                            <div className='flex justify-between'>
                                <span className='text-sm text-gray-600'>Total Transaksi</span>
                                <span className='font-medium'>{recipient?._count.transactions}</span>
                            </div>
                            <div className='flex justify-between'>
                                <span className='text-sm text-gray-600'>Transaksi Terakhir</span>
                                <span className='font-medium'>
                                    {formatDate(
                                        recipient?.transactions
                                            .slice()
                                            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                                            .shift()?.date || ''
                                    )}
                                </span>
                            </div>
                            <div className='flex justify-between'>
                                <span className='text-sm text-gray-600'>Total Pengeluaran</span>
                                <span className='font-medium'>{formatCurrency(_.sum(_.map(recipient?.transactions, 'totalAmount')))}</span>
                            </div>
                            <div className='flex justify-between'>
                                <span className='text-sm text-gray-600'>Pendapatan per Kapita</span>
                                <span className='font-medium'>{formatCurrency(Number(recipient?.income) / recipient?.familiyMembers)}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Location */}
                    <Card className='p-6'>
                        <h3 className='text-lg font-semibold text-gray-800 mb-4'>Lokasi</h3>
                        <div className='space-y-3'>
                            <p className='text-sm text-gray-600'>{recipient?.address}</p>
                            <SecondaryButton Icon={MapPin} size='sm' className='w-full' onClick={handleViewMap}>
                                Lihat di Peta
                            </SecondaryButton>
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Edit Modal */}
            <RecipientForm
                isOpen={state.modalType === 'recipientForm' && state.openModal}
                register={register}
                setValue={setValue}
                watch={watch}
                onClose={() => {
                    handleModalChange('', null);
                    reset({});
                }}
                isEdit={true}
                products={products}
                merchants={merchants}
                onSubmit={handleSubmit(onSubmit)}
            />

            {/* Suspend Modal */}
            <SuspendModal
                isOpen={state.modalType === 'suspend' && state.openModal}
                onClose={() => handleModalChange('', null)}
                onSuspend={onSuspendRecipient}
                selectedRecipient={state.modalData}
            />

            {/* Add Quota Modal */}
            <Modal isOpen={showQuotaModal} onClose={() => setShowQuotaModal(false)} title='Tambah Kuota' size='md'>
                <form className='space-y-4'>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Jenis Subsidi</label>
                        <select className='w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'>
                            <option value=''>Pilih Jenis Subsidi</option>
                            <option value='pupuk'>Pupuk</option>
                            <option value='LPG'>LPG</option>
                        </select>
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Jumlah Kuota Tambahan</label>
                        <input
                            type='number'
                            className='w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                            placeholder='Masukkan jumlah kuota'
                        />
                    </div>
                    <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>Alasan Penambahan</label>
                        <textarea
                            className='w-full px-3 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                            rows={3}
                            placeholder='Masukkan alasan penambahan kuota...'
                        />
                    </div>
                    <div className='flex justify-end space-x-3 pt-4'>
                        <SecondaryButton onClick={() => setShowQuotaModal(false)}>Batal</SecondaryButton>
                        <PrimaryButton>Tambah Kuota</PrimaryButton>
                    </div>
                </form>
            </Modal>

            {/* Map Modal */}
            <Modal isOpen={showMapModal} onClose={() => setShowMapModal(false)} title='Lokasi Penerima' size='xl'>
                <div className='space-y-4'>
                    <GoogleMap
                        center={recipientCoordinates}
                        zoom={15}
                        markers={[
                            {
                                position: recipientCoordinates,
                                title: recipient?.name,
                                info: recipient?.address,
                            },
                        ]}
                        height='400px'
                    />
                    <div className='p-4 bg-blue-50 rounded-xl'>
                        <h4 className='font-medium text-blue-800 mb-2'>{recipient?.name}</h4>
                        <p className='text-sm text-blue-700'>{recipient?.address}</p>
                        <div className='mt-3 flex gap-2'>
                            <SecondaryButton Icon={MapPin} size='sm'>
                                Buka di Google Maps
                            </SecondaryButton>
                            <SecondaryButton size='sm'>Dapatkan Arah</SecondaryButton>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default RecipientsDetailPage;
