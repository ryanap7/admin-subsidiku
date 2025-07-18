import { motion } from 'framer-motion';
import _ from 'lodash';
import { ArrowLeft, Calendar, CheckCircle, DollarSign, Download, Eye, FileText, MapPin, Package, Phone, User, XCircle } from 'lucide-react';
import React, { useEffect, useReducer, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import SecondaryButton from '../components/Buttons/SecondaryButton';
import TextArea from '../components/Input/TextArea';
import TransactionRecipeModal from '../components/Modules/Transaction/TransactionRecipeModal';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import ConfirmModal from '../components/UI/ConfirmModal';
import { useTransactionStore } from '../store/useTransactionStore';
import { Transaction } from '../types';
import { formatCurrency, formatDateTime, getTransactionStatusColor, getTransactionStatusIcon } from '../utils';
import { TransactionStatus } from '../utils/enums';
import { actionCreators, globalReducer, initialState } from '../utils/globalReducer';

const TransactionDetailPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [transaction, setTransaction] = useState<Transaction | null>(null);
    const [rejectNotes, setRejectNotes] = useState<string>('');

    const [state, dispatch] = useReducer(globalReducer, initialState);

    const { getTransaction, approveTransaction, rejectTransaction } = useTransactionStore();

    const recipient = transaction?.recipient;
    const merchant = transaction?.merchant;

    const StatusIcon = getTransactionStatusIcon(transaction?.status);

    useEffect(() => {
        if (!id) return;

        getTransactionDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const getTransactionDetail = async () => {
        try {
            const response = await getTransaction(id as string);
            setTransaction(response);
        } catch (error) {
            console.error('Failed to fetch recipient:', error);
            toast.error('Gagal mengambil data transaksi');
        }
    };

    const handleDownloadPDF = () => {
        // Simulate PDF download
        const link = document.createElement('a');
        link.href = '#';
        link.download = `transaction-${transaction?.number}.pdf`;
        link.click();
        alert('PDF berhasil diunduh!');
    };

    const handleApprove = async () => {
        try {
            await approveTransaction(String(transaction?.number));
            toast.success('Transaksi berhasil disetujui!');
            handleModalChange('', null);
            getTransactionDetail();
        } catch (error) {
            console.error('Failed to approve transaction:', error);
            toast.error('Gagal menyetujui transaksi');
        }
    };

    const handleReject = async () => {
        if (_.isEmpty(rejectNotes)) {
            toast.error('Harap masukkan alasan penolakan');
            return;
        }

        try {
            await rejectTransaction(String(transaction?.number), rejectNotes);
            toast.success('Transaksi berhasil ditolak!');
            handleModalChange('', null);
            getTransactionDetail();
            setRejectNotes('');
        } catch (error) {
            console.error('Failed to reject transaction:', error);
            toast.error('Gagal menolak transaksi');
        }
    };

    const showAlert = (text: string) => {
        alert(text);
    };

    const handleNavigation = (url: string) => {
        navigate(url);
    };

    const handleModalChange = (type: string, data: Transaction | null) => {
        if (type === '') {
            dispatch(actionCreators.closeModal());
        } else {
            dispatch(actionCreators.openModal(type, data));
        }

        if (type === '') {
            setRejectNotes('');
        }
    };

    const handleConfirm = () => {
        if (state.modalType === 'approve') {
            handleApprove();
        } else {
            handleReject();
        }
    };

    const transactionAmountDetail = [
        {
            label: 'Jumlah',
            price: null,
            value: `${transaction?.qty} ${transaction?.product?.unit}`,
        },
        {
            label: 'Total Harga Dasar',
            price: transaction?.basePrice,
            value: formatCurrency((transaction?.basePrice || 0) * (transaction?.qty || 0)),
        },
        {
            label: 'Total Subsidi Pemerintah',
            price: transaction?.product?.subsidyPrice,
            value: `-${formatCurrency((transaction?.product?.subsidyPrice || 0) * (transaction?.qty || 0))}`,
        },
    ];

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
                    <Button variant='secondary' onClick={() => navigate('/transactions')}>
                        <ArrowLeft className='w-4 h-4 mr-2' />
                        Kembali
                    </Button>
                    <div>
                        <h1 className='text-3xl font-semibold text-gray-800'>
                            Transaksi <span className='font-bold'>{transaction?.number}</span>
                        </h1>
                        <p className='text-gray-600 mt-1'>Detail transaksi subsidi</p>
                    </div>
                </div>
                <div className='flex gap-3'>
                    <Button variant='secondary' onClick={() => handleModalChange('print', transaction)}>
                        <FileText className='w-4 h-4 mr-2' />
                        Cetak Bukti
                    </Button>
                    {transaction?.status === TransactionStatus.Menunggu && (
                        <>
                            <Button variant='success' Icon={CheckCircle} onClick={() => handleModalChange('approve', transaction)}>
                                Setujui
                            </Button>
                            <Button variant='danger' Icon={XCircle} onClick={() => handleModalChange('reject', transaction)}>
                                Tolak
                            </Button>
                        </>
                    )}
                </div>
            </motion.div>

            {/* Status Banner */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
                <Card className='p-6'>
                    <div className='flex items-center justify-between'>
                        <div className='flex items-center space-x-4'>
                            <div
                                className={`w-16 h-16 rounded-full flex items-center justify-center ${
                                    transaction?.status === TransactionStatus.Selesai
                                        ? 'bg-green-100'
                                        : transaction?.status === TransactionStatus.Menunggu
                                        ? 'bg-yellow-100'
                                        : 'bg-red-100'
                                }`}
                            >
                                <StatusIcon
                                    className={`w-8 h-8 ${
                                        transaction?.status === TransactionStatus.Selesai
                                            ? 'text-green-600'
                                            : transaction?.status === TransactionStatus.Menunggu
                                            ? 'text-yellow-600'
                                            : 'text-red-600'
                                    }`}
                                />
                            </div>
                            <div>
                                <h2 className='text-2xl font-bold text-gray-800'>
                                    Status:{' '}
                                    <span
                                        className={`${
                                            transaction?.status === TransactionStatus.Selesai
                                                ? 'text-green-600'
                                                : transaction?.status === TransactionStatus.Menunggu
                                                ? 'text-yellow-600'
                                                : 'text-red-600'
                                        }`}
                                    >
                                        {transaction?.status}
                                    </span>
                                </h2>
                                <p className='text-gray-600'>
                                    {transaction?.status === TransactionStatus.Selesai && 'Transaksi telah berhasil diproses'}
                                    {transaction?.status === TransactionStatus.Menunggu && 'Transaksi menunggu persetujuan'}
                                    {transaction?.status === TransactionStatus.Gagal && 'Transaksi gagal diproses'}
                                </p>
                            </div>
                        </div>
                        <div className='text-right'>
                            <p className='text-sm text-gray-600'>Total Pembayaran</p>
                            <p className='text-3xl font-bold text-gray-800'>{formatCurrency(Number(transaction?.totalAmount))}</p>
                        </div>
                    </div>
                </Card>
            </motion.div>

            <div className='grid grid-cols-1 lg:grid-cols-3 gap-6'>
                {/* Main Content */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className='lg:col-span-2 space-y-6'
                >
                    {/* Transaction Details */}
                    <Card className='p-6'>
                        <h3 className='text-xl font-semibold text-gray-800 mb-6'>Detail Transaksi</h3>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div className='space-y-4'>
                                <div>
                                    <p className='text-sm text-gray-600'>ID Transaksi</p>
                                    <p className='font-medium text-lg'>{transaction?.number}</p>
                                </div>
                                <div>
                                    <p className='text-sm text-gray-600'>Tanggal & Waktu</p>
                                    <p className='font-medium'>{formatDateTime(transaction?.date)}</p>
                                </div>
                                <div>
                                    <p className='text-sm text-gray-600'>Produk</p>
                                    <p className='font-medium capitalize'>{transaction?.product?.name}</p>
                                </div>
                                <div>
                                    <p className='text-sm text-gray-600'>Jumlah</p>
                                    <p className='font-medium'>
                                        {transaction?.qty} {transaction?.product?.unit}
                                    </p>
                                </div>
                            </div>
                            <div className='space-y-4'>
                                <div>
                                    <p className='text-sm text-gray-600'>Metode Pembayaran</p>
                                    <p className='font-medium'>{transaction?.paymentMethod}</p>
                                </div>
                                <div>
                                    <p className='text-sm text-gray-600'>Diproses Oleh</p>
                                    {/* Dummy */}
                                    <p className='font-medium'>Admin</p>
                                </div>
                                <div>
                                    <p className='text-sm text-gray-600'>Status</p>
                                    <span
                                        className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getTransactionStatusColor(
                                            transaction?.status
                                        )}`}
                                    >
                                        {transaction?.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Recipient Information */}
                    <Card className='p-6'>
                        <h3 className='text-xl font-semibold text-gray-800 mb-6 flex items-center'>
                            <User className='w-5 h-5 mr-2' />
                            Informasi Penerima
                        </h3>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div className='space-y-4'>
                                <div>
                                    <p className='text-sm text-gray-600'>NIK</p>
                                    <p className='font-medium'>{recipient?.nik}</p>
                                </div>
                                <div>
                                    <p className='text-sm text-gray-600'>Nama Lengkap</p>
                                    <p className='font-medium'>{recipient?.name}</p>
                                </div>
                            </div>
                            <div className='space-y-4'>
                                <div>
                                    <p className='text-sm text-gray-600'>Alamat</p>
                                    <p className='font-medium'>{recipient?.address}</p>
                                </div>
                                <div>
                                    <Button variant='secondary' size='sm' onClick={() => handleNavigation(`/recipient/${recipient?.id}`)}>
                                        <Eye className='w-4 h-4 mr-2' />
                                        Lihat Detail Penerima
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Agent Information */}
                    <Card className='p-6'>
                        <h3 className='text-xl font-semibold text-gray-800 mb-6 flex items-center'>
                            <Package className='w-5 h-5 mr-2' />
                            Informasi Agen
                        </h3>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                            <div className='space-y-4'>
                                <div>
                                    <p className='text-sm text-gray-600'>Nama Agen</p>
                                    <p className='font-medium'>{merchant?.name}</p>
                                </div>
                                <div>
                                    <p className='text-sm text-gray-600'>Alamat</p>
                                    <p className='font-medium'>{merchant?.address ?? '-'}</p>
                                </div>
                            </div>
                            <div className='space-y-4'>
                                <div className='flex gap-2'>
                                    <SecondaryButton Icon={Eye} size='sm' onClick={() => handleNavigation(`/agents/${merchant?.id}`)}>
                                        Lihat Detail Agen
                                    </SecondaryButton>
                                    <SecondaryButton Icon={MapPin} size='sm' onClick={() => handleNavigation('/map')}>
                                        Lokasi
                                    </SecondaryButton>
                                </div>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/* Sidebar */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className='space-y-6'
                >
                    {/* Payment Breakdown */}
                    <Card className='p-6'>
                        <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
                            <DollarSign className='w-5 h-5 mr-2' />
                            Rincian Transaksi
                        </h3>
                        <div className='space-y-3'>
                            {transactionAmountDetail?.map((item, index) => (
                                <div key={index} className='flex justify-between items-start'>
                                    <span className='text-sm text-gray-600'>
                                        {item.label} <br />{' '}
                                        {item.price && (
                                            <span className='text-xs text-gray-500'>
                                                ({transaction?.qty} × {formatCurrency(item.price)})
                                            </span>
                                        )}
                                    </span>
                                    <span className={`font-medium text-gray-800 ${index == 2 ? 'text-green-600' : ''}`}>{item.value}</span>
                                </div>
                            ))}

                            {/* Total Transaksi */}
                            <hr className='my-2' />
                            <div className='flex justify-between items-center'>
                                <span className='font-medium text-gray-800'>Total Dibayar</span>
                                <span className='font-bold text-lg text-gray-800'>{formatCurrency(transaction?.totalAmount)}</span>
                            </div>
                        </div>
                    </Card>

                    {/* Timeline */}
                    <Card className='p-6'>
                        <h3 className='text-lg font-semibold text-gray-800 mb-4 flex items-center'>
                            <Calendar className='w-5 h-5 mr-2' />
                            Timeline
                        </h3>
                        <div className='space-y-4'>
                            <div className='flex items-start space-x-3'>
                                <div className='w-2 h-2 bg-green-500 rounded-full mt-2'></div>
                                <div>
                                    <p className='text-sm font-medium text-gray-800'>Transaksi Dibuat</p>
                                    <p className='text-xs text-gray-500'>{formatDateTime(transaction?.date)}</p>
                                </div>
                            </div>
                            {transaction?.status !== TransactionStatus.Menunggu && (
                                <div className='flex items-start space-x-3'>
                                    <div
                                        className={`w-2 h-2 rounded-full mt-2 ${
                                            transaction?.status === TransactionStatus.Selesai ? 'bg-green-500' : 'bg-red-500'
                                        }`}
                                    ></div>
                                    <div>
                                        <p className='text-sm font-medium text-gray-800'>
                                            {transaction?.status === TransactionStatus.Selesai ? 'Transaksi Selesai' : 'Transaksi Gagal'}
                                        </p>
                                        <p className='text-xs text-gray-500'>{formatDateTime(transaction?.date)}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </Card>

                    {/* Notes */}
                    <Card className='p-6'>
                        <h3 className='text-lg font-semibold text-gray-800 mb-4'>Catatan</h3>
                        <div className='p-3 bg-gray-50 rounded-xl'>
                            <p className='text-sm text-gray-700'>{transaction?.notes ?? <center>Tidak ada catatan</center>}</p>
                        </div>
                    </Card>

                    {/* Quick Actions */}
                    <Card className='p-6'>
                        <h3 className='text-lg font-semibold text-gray-800 mb-4'>Aksi Cepat</h3>
                        <div className='space-y-2'>
                            <SecondaryButton Icon={Download} onClick={handleDownloadPDF} size='sm'>
                                Download PDF
                            </SecondaryButton>
                            <SecondaryButton Icon={Phone} onClick={() => showAlert(`Menghubungi ${recipient?.name} via WhatsApp...`)} size='sm'>
                                Hubungi Penerima
                            </SecondaryButton>
                            <SecondaryButton Icon={Phone} onClick={() => showAlert(`Menghubungi ${merchant?.name} via telepon...`)} size='sm'>
                                Hubungi Agen
                            </SecondaryButton>
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Print Receipt Modal */}
            <TransactionRecipeModal
                isOpen={state.openModal && state.modalType === 'print'}
                onClose={() => handleModalChange('', null)}
                transaction={transaction}
                recipient={recipient}
            />

            {/* Approve/Reject Confirm Modal */}
            <ConfirmModal
                isOpen={state.openModal && (state.modalType === 'approve' || state.modalType === 'reject')}
                title={`${state.modalType === 'approve' ? 'Setujui ' : 'Tolak '} Transaksi`}
                message={
                    <span>
                        Apakah kamu yakin ingin {state.modalType === 'approve' ? 'menyetujui' : 'menolak'} transaksi{' '}
                        <strong>{transaction?.number}</strong>? Tindakan ini tidak bisa dibatalkan.
                    </span>
                }
                confirmText={state.modalType === 'approve' ? 'Setujui' : 'Tolak'}
                onClose={() => handleModalChange('', null)}
                onConfirm={handleConfirm}
                loading={false}
                variant={state.modalType === 'approve' ? 'primary' : 'danger'}
                children={
                    state.modalType === 'reject' && (
                        <div className='py-4'>
                            <TextArea
                                name='notes'
                                label='Alasan Penolakan'
                                placeholder='Masukkan alasan penolakan'
                                onChange={(e) => setRejectNotes(e.target.value)}
                            />
                        </div>
                    )
                }
            />
        </div>
    );
};

export default TransactionDetailPage;
