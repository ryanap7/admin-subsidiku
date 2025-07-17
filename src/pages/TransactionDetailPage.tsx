import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, CheckCircle, Clock, DollarSign, Download, Eye, FileText, MapPin, Package, Phone, User, XCircle } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import Modal from '../components/UI/Modal';
import { useTransactionStore } from '../store/useTransactionStore';
import { Transaction } from '../types';
import { formatCurrency, formatDateTime, getTransactionStatusColor } from '../utils';
import { TransactionStatus } from '../utils/enums';

const TransactionDetailPage: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [showPrintModal, setShowPrintModal] = useState(false);

    const [transaction, setTransaction] = useState<Transaction | null>(null);

    const recipient = transaction?.recipient;
    const merchant = transaction?.merchant;

    const { getTransaction } = useTransactionStore();

    useEffect(() => {
        if (!id) return;

        fetchRecipient();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const fetchRecipient = async () => {
        try {
            const response = await getTransaction(id as string);
            setTransaction(response);
        } catch (error) {
            console.error('Failed to fetch recipient:', error);
            toast.error('Gagal mengambil data transaksi');
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case TransactionStatus.Selesai:
                return CheckCircle;
            case TransactionStatus.Menunggu:
                return Clock;
            case TransactionStatus.Gagal:
                return XCircle;
            default:
                return FileText;
        }
    };

    const handlePrintReceipt = () => {
        setShowPrintModal(true);
    };

    const handleDownloadPDF = () => {
        // Simulate PDF download
        const link = document.createElement('a');
        link.href = '#';
        link.download = `transaction-${transaction?.id}.pdf`;
        link.click();
        alert('PDF berhasil diunduh!');
    };

    const handleContactRecipient = () => {
        alert(`Menghubungi ${recipient?.name} via WhatsApp...`);
    };

    const handleContactAgent = () => {
        alert(`Menghubungi ${merchant?.name} via telepon...`);
    };

    const handleViewRecipientDetail = () => {
        navigate(`/recipients/${recipient?.id}`); 
    };

    const handleViewAgentDetail = () => {
        navigate(`/agents/${merchant?.id}`);
    };

    const handleViewAgentLocation = () => {
        navigate('/map');
    };

    const StatusIcon = getStatusIcon(transaction?.status);

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
                        <h1 className='text-3xl font-semibold text-gray-800'>Transaksi <span className='font-bold'>{transaction?.id}</span></h1>
                        <p className='text-gray-600 mt-1'>Detail transaksi subsidi</p>
                    </div>
                </div>
                <div className='flex gap-3'>
                    <Button variant='secondary' onClick={handlePrintReceipt}>
                        <FileText className='w-4 h-4 mr-2' />
                        Cetak Bukti
                    </Button>
                    {transaction?.status === TransactionStatus.Menunggu && (
                        <>
                            <Button variant='success'>
                                <CheckCircle className='w-4 h-4 mr-2' />
                                Setujui
                            </Button>
                            <Button variant='danger'>
                                <XCircle className='w-4 h-4 mr-2' />
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
                                    <Button variant='secondary' size='sm' onClick={handleViewRecipientDetail}>
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
                                    <Button variant='secondary' size='sm' onClick={handleViewAgentDetail}>
                                        <Eye className='w-4 h-4 mr-2' />
                                        Lihat Detail Agen
                                    </Button>
                                    <Button variant='secondary' size='sm' onClick={handleViewAgentLocation}>
                                        <MapPin className='w-4 h-4 mr-2' />
                                        Lokasi
                                    </Button>
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
                            {/* Informasi Kuantitas */}
                            <div className='flex justify-between items-center'>
                                <span className='text-sm text-gray-600'>Jumlah</span>
                                <span className='font-medium text-gray-800'>{transaction?.qty} {transaction?.product?.unit}</span>
                            </div>

                            {/* Total Harga Dasar */}
                            <div className='flex justify-between items-center'>
                                <span className='text-sm text-gray-600'>
                                    Total Harga Dasar ({transaction?.qty} × {formatCurrency(transaction?.basePrice)})
                                </span>
                                <span className='font-medium text-gray-800'>
                                    {formatCurrency((transaction?.basePrice || 0) * (transaction?.qty || 0))}
                                </span>
                            </div>

                            {/* Total Subsidi */}
                            <div className='flex justify-between items-center'>
                                <span className='text-sm text-gray-600'>
                                    Total Subsidi Pemerintah ({transaction?.qty} × {formatCurrency(transaction?.product?.subsidyPrice)})
                                </span>
                                <span className='font-medium text-green-600'>
                                    -{formatCurrency((transaction?.product?.subsidyPrice || 0) * (transaction?.qty || 0))}
                                </span>
                            </div>

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
                            <Button variant='secondary' size='sm' className='w-full' onClick={handleDownloadPDF}>
                                <Download className='w-4 h-4 mr-2' />
                                Download PDF
                            </Button>
                            <Button variant='secondary' size='sm' className='w-full' onClick={handleContactRecipient}>
                                <Phone className='w-4 h-4 mr-2' />
                                Hubungi Penerima
                            </Button>
                            <Button variant='secondary' size='sm' className='w-full' onClick={handleContactAgent}>
                                <Phone className='w-4 h-4 mr-2' />
                                Hubungi Agen
                            </Button>
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Print Receipt Modal */}
            <Modal isOpen={showPrintModal} onClose={() => setShowPrintModal(false)} title='Cetak Bukti Transaksi' size='lg'>
                <div className='space-y-6'>
                    <div className='text-center border-b pb-4'>
                        <h2 className='text-xl font-bold text-gray-800'>BUKTI TRANSAKSI SUBSIDI</h2>
                        <p className='text-sm text-gray-600'>Kementerian Pertanian Republik Indonesia</p>
                    </div>

                    <div className='grid grid-cols-2 gap-6'>
                        <div>
                            <h3 className='font-semibold text-gray-800 mb-3'>Informasi Transaksi</h3>
                            <div className='space-y-2 text-sm'>
                                <div className='flex justify-between'>
                                    <span>ID Transaksi:</span>
                                    <span className='font-medium'>{transaction?.id}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span>Tanggal:</span>
                                    <span className='font-medium'>{formatDateTime(transaction?.date)}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span>Status:</span>
                                    <span className='font-medium'>{transaction?.status}</span>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className='font-semibold text-gray-800 mb-3'>Informasi Penerima</h3>
                            <div className='space-y-2 text-sm'>
                                <div className='flex justify-between'>
                                    <span>NIK:</span>
                                    <span className='font-medium'>{recipient?.nik}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span>Nama:</span>
                                    <span className='font-medium'>{recipient?.name}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className='font-semibold text-gray-800 mb-3'>Detail Produk</h3>
                        <div className='bg-gray-50 p-4 rounded-xl'>
                            <div className='flex justify-between items-center'>
                                <div>
                                    <p className='font-medium capitalize'>{transaction?.product?.name}</p>
                                    <p className='text-sm text-gray-600'>
                                        {transaction?.qty} {transaction?.product?.unit}
                                    </p>
                                </div>
                                <div className='text-right'>
                                    <p className='font-bold text-lg'>{formatCurrency(transaction?.amount)}</p>
                                    <p className='text-sm text-gray-600'>Setelah subsidi</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='text-center text-xs text-gray-500 border-t pt-4'>
                        <p>Dokumen ini dicetak pada {new Date().toLocaleDateString('id-ID')}</p>
                        <p>Untuk informasi lebih lanjut hubungi call center: 1500-123</p>
                    </div>

                    <div className='flex justify-end space-x-3'>
                        <Button variant='secondary' onClick={() => setShowPrintModal(false)}>
                            Tutup
                        </Button>
                        <Button variant='primary' onClick={() => window.print()}>
                            <FileText className='w-4 h-4 mr-2' />
                            Cetak
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default TransactionDetailPage;
