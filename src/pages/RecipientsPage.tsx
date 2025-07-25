import { motion } from 'framer-motion';
import _ from 'lodash';
import { Download, Edit, Eye, Plus, Trash2, UserX } from 'lucide-react';
import React, { useEffect, useMemo, useReducer, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import PrimaryButton from '../components/Buttons/PrimaryButton';
import SecondaryButton from '../components/Buttons/SecondaryButton';
import SearchInput from '../components/Input/SearchInput';
import RecipientForm from '../components/Modules/Recipient/RecipientForm';
import RecipientSummary from '../components/Modules/Recipient/RecipientSummary';
import SuspendModal from '../components/Modules/Recipient/SuspendModal';
import FilterSelection from '../components/Select/FilterSelection';
import Card from '../components/UI/Card';
import ConfirmModal from '../components/UI/ConfirmModal';
import PageHeader from '../components/UI/PageHeader';
import { useMerchantStore } from '../store/useMerchantStore';
import { useProductStore } from '../store/useProductStore';
import { useRecipientStore } from '../store/useRecipientStore';
import { Recipient, Subsidy } from '../types';
import {
    formatCurrency,
    generateOptions,
    getClassificationColor,
    getClassificationIcon,
    getClassificationLabel,
    getRecipientStatusColor,
    getRecipientStatusLabel,
    returnInitial,
} from '../utils';
import { actionCreators, globalReducer, initialState } from '../utils/globalReducer';
import { classificationOptions, recipientStatus } from '../utils/options';

const RecipientTable: React.FC<{
    recipients: Recipient[];
    onView: (r: Recipient) => void;
    onEdit: (r: Recipient) => void;
    onSuspend: (r: Recipient) => void;
    onDelete: (r: Recipient) => void;
}> = ({ recipients, onView, onEdit, onSuspend, onDelete }) => (
    <Card className='overflow-hidden'>
        <div className='overflow-x-auto'>
            <table className='w-full'>
                <thead className='bg-gray-50'>
                    <tr>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Penerima</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>NIK</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Alamat</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Klasifikasi</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Pendapatan</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Jenis Subsidi</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Saldo</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Status</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Kuota</th>
                        <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Aksi</th>
                    </tr>
                </thead>
                <tbody className='bg-white divide-y divide-gray-200'>
                    {recipients.map((recipient) => {
                        const ClassificationIcon = getClassificationIcon(recipient.classification);

                        return (
                            <motion.tr
                                key={recipient.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.3 }}
                                className='hover:bg-gray-50 transition-colors'
                            >
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <div className='flex items-center'>
                                        <div className='w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center'>
                                            <span className='text-white font-medium text-sm'>{returnInitial(recipient.name)}</span>
                                        </div>
                                        <div className='ml-4'>
                                            <div className='text-sm font-medium text-gray-900'>{recipient.name}</div>
                                            <div className='text-sm text-gray-500'>{recipient.district}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{recipient.nik}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{recipient.address}</td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    {recipient.classification ? (
                                        <div className='flex items-center'>
                                            <ClassificationIcon className='w-4 h-4 mr-2 text-gray-400' />
                                            <span
                                                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getClassificationColor(
                                                    recipient.classification
                                                )}`}
                                            >
                                                {getClassificationLabel(recipient.classification)}
                                            </span>
                                        </div>
                                    ) : (
                                        '-'
                                    )}
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{formatCurrency(Number(recipient.income) || 0)}</td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                                    {recipient.subsidies.length > 0
                                        ? recipient.subsidies.map((subsidy, index) => (
                                              <span
                                                  key={index}
                                                  className='inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 mr-1'
                                              >
                                                  {subsidy?.product?.name}
                                              </span>
                                          ))
                                        : '-'}
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                                    {formatCurrency(Number(recipient.balance) || 0)}
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                    <span
                                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRecipientStatusColor(
                                            recipient.status
                                        )}`}
                                    >
                                        {getRecipientStatusLabel(recipient.status)}
                                    </span>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                                    {recipient.subsidies.length > 0
                                        ? recipient.subsidies.map((subsidy, index) => (
                                              <span key={index} className='text-sm'>
                                                  {subsidy?.product?.name} : {subsidy?.remainingQuota} / {subsidy?.monthlyQuota}
                                                  <br />
                                              </span>
                                          ))
                                        : '-'}
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                                    <div className='flex space-x-2'>
                                        <button
                                            onClick={() => onView(recipient)}
                                            className='text-blue-600 hover:text-blue-800 transition-colors'
                                            title='Lihat Detail'
                                        >
                                            <Eye className='w-4 h-4' />
                                        </button>
                                        <button
                                            onClick={() => onEdit(recipient)}
                                            className='text-green-600 hover:text-green-800 transition-colors'
                                            title='Edit Data'
                                        >
                                            <Edit className='w-4 h-4' />
                                        </button>
                                        {recipient.status === 'Aktif' && (
                                            <button
                                                onClick={() => onSuspend(recipient)}
                                                className='text-red-600 hover:text-red-800 transition-colors'
                                                title='Tangguhkan'
                                            >
                                                <UserX className='w-4 h-4' />
                                            </button>
                                        )}
                                        <button
                                            onClick={() => onDelete(recipient)}
                                            className='text-red-600 hover:text-red-800 transition-colors'
                                            title='Hapus Data'
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
);

const RecipientsPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterSubsidy, setFilterSubsidy] = useState('all');
    const [filterClassification, setFilterClassification] = useState('all');

    const [state, dispatch] = useReducer(globalReducer, initialState);

    const { recipients, fetchRecipients, createRecipient, updateRecipient, deleteRecipient, getRecipient } = useRecipientStore();
    const { products, fetchProducts } = useProductStore();
    const { merchants, fetchMerchants } = useMerchantStore();

    const { register, handleSubmit, setValue, watch, getValues, reset } = useForm<Recipient & { subsidies: string[] }>({});

    useEffect(() => {
        fetchRecipients();
        fetchProducts();
        fetchMerchants();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (!state.openModal) {
            reset({});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [state.openModal]);

    const getRecipientDetail = async (id: string) => {
        try {
            const response = await getRecipient(id as string);
            handleModalChange('recipientForm', null);
            reset({
                ...response,
                haveBankAccount: String(response?.haveBankAccount),
                merchantId:  response?.merchantId ?? response?.merchant?.id,
                subsidies: response?.subsidies.map((s) => s.product.id),
            });
        } catch (error) {
            console.error('Failed to fetch recipient:', error);
            toast.error('Gagal mengambil data penerima');
        }
    };

    const onSubmit = async (data: Recipient & { subsidies: string[] }) => {
        dispatch(actionCreators.setLoading(true));
        try {
            data['haveBankAccount'] = data.haveBankAccount === 'true';

            const removedKeys = ['id', 'balance', 'avatar', 'createdAt', 'updatedAt', 'merchant', 'transactions', '_count'];
            const payload = _.omit(data, removedKeys);

            if (getValues('id')) {
                await updateRecipient(data.id, _.omit(payload, 'subsidies') as Recipient);

                toast.success('Berhasil memperbarui data');
            } else {
                await createRecipient(payload as Recipient);

                toast.success('Penerima subsidi berhasil ditambahkan');
            }

            fetchRecipients();
            handleModalChange('', null);
            reset({});
        } catch (error) {
            console.error('Failed to update recipient:', error);
            if (getValues('id')) {
                toast.error('Gagal memperbarui data');
            } else {
                toast.error('Gagal menambahkan penerima subsidi');
            }
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
            fetchRecipients();
            handleModalChange('', null);
        } catch (error) {
            console.error('Failed to suspend recipient:', error);
            toast.error('Penerima subsidi gagal ditangguhkan');
        }
    };

    const onDeleteRecipient = async () => {
        if (!state.modalData) return;
        try {
            await deleteRecipient(state.modalData.id);
            toast.success('Penerima subsidi berhasil dihapus');
            fetchRecipients();
            handleModalChange('', null);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            toast.error('Gagal menghapus penerima subsidi');
        }
    };

    const handleModalChange = (type: string, data: Recipient | null) => {
        if (type === '') {
            dispatch(actionCreators.closeModal());
        } else {
            dispatch(actionCreators.openModal(type, data));
        }
    };

    const filteredRecipients = useMemo(
        () =>
            recipients.filter((recipient) => {
                const matchesSearch = recipient.name.toLowerCase().includes(searchTerm.toLowerCase()) || recipient.nik.includes(searchTerm);
                const matchesStatus = filterStatus === 'all' || recipient.status === filterStatus;
                const matchesSubsidy =
                    filterSubsidy === 'all' || recipient.subsidies?.find((subsidy) => (subsidy as Subsidy)?.product?.name === filterSubsidy);
                const matchesClassification = filterClassification === 'all' || recipient.classification === filterClassification;

                return matchesSearch && matchesStatus && matchesSubsidy && matchesClassification;
            }),
        [recipients, searchTerm, filterStatus, filterSubsidy, filterClassification]
    );

    // Handlers
    const handleViewDetails = (recipient: Recipient) => navigate(`/recipients/${recipient.id}`);

    return (
        <div className='space-y-6'>
            {/* Header */}
            <PageHeader
                title='Penerima Subsidi'
                description='Kelola data penerima subsidi pupuk dan LPG dengan klasifikasi ekonomi'
                children={
                    <div className='flex gap-3'>
                        <SecondaryButton Icon={Download} variant='secondary' onClick={() => {}}>
                            Export
                        </SecondaryButton>
                        <PrimaryButton Icon={Plus} onClick={() => handleModalChange('recipientForm', null)}>
                            Tambah Penerima
                        </PrimaryButton>
                    </div>
                }
            />

            {/* Summary Cards */}
            <RecipientSummary />

            {/* Filters */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
                <Card className='p-6'>
                    <div className='flex flex-col lg:flex-row gap-4'>
                        <SearchInput
                            placeholder='Cari berdasarkan nama atau NIK...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />

                        <div className='flex gap-3'>
                            <FilterSelection
                                options={[{ value: 'all', label: 'Semua Status' }, ...recipientStatus]}
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            />
                            <FilterSelection
                                options={[{ value: 'all', label: 'Semua Jenis' }, ...generateOptions(products, 'name', 'id')]}
                                value={filterSubsidy}
                                onChange={(e) => setFilterSubsidy(e.target.value)}
                            />
                            <FilterSelection
                                options={[{ value: 'all', label: 'Semua Klasifikasi' }, ...classificationOptions]}
                                value={filterClassification}
                                onChange={(e) => setFilterClassification(e.target.value)}
                            />
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.7 }}>
                <RecipientTable
                    recipients={filteredRecipients}
                    onView={handleViewDetails}
                    onEdit={(recipient) => getRecipientDetail(recipient.id)}
                    onDelete={(recipient) => handleModalChange('delete', recipient)}
                    onSuspend={(recipient) => handleModalChange('suspend', recipient)}
                />
            </motion.div>

            {/* Add/Edit Recipient Modal */}
            <RecipientForm
                isOpen={state.modalType === 'recipientForm' && state.openModal}
                register={register}
                setValue={setValue}
                watch={watch}
                onClose={() => {
                    handleModalChange('', null);
                    reset({});
                }}
                isEdit={getValues('id') !== undefined}
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

            {/* Delete Confirm */}
            <ConfirmModal
                isOpen={state.modalType === 'delete' && state.openModal}
                title='Hapus Penerima Subsidi'
                message={
                    <span>
                        Apakah Anda yakin ingin menghapus <strong>{state.modalData?.name}</strong> sebagai penerima subsidi? Tindakan ini tidak bisa
                        dibatalkan.
                    </span>
                }
                confirmText='Ya, Hapus'
                cancelText='Batal'
                onClose={() => handleModalChange('', null)}
                onConfirm={onDeleteRecipient}
                loading={false}
            />
        </div>
    );
};

export default RecipientsPage;
