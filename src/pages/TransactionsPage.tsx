import { motion } from 'framer-motion';
import { ChevronDown, Download, Eye, FileText, Search } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionSummary from '../components/Modules/Transaction/TransactionSummary';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import { useTransactionStore } from '../store/useTransactionStore';
import { Recipient, Transaction } from '../types';
import { formatCurrency, formatDate, getTransactionStatusColor } from '../utils';
import SelectRecipientStatus from '../components/Select/SelectRecipientStatus';

const TransactionsPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterRecipientStatus, setFilterRecipientStatus] = useState('all');
    const [filterProduct, setFilterProduct] = useState('all');
    const [filterDate, setFilterDate] = useState('all');

    const { transactions, fetchTransactions } = useTransactionStore();

    useEffect(() => {
        fetchTransactions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    console.log(transactions);

    const filteredTransactions = transactions.filter((transaction) => {
        const recipient = transaction.metadataRecipient as Recipient;

        const matchesSearch =
            recipient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recipient?.nik.includes(searchTerm) ||
            String(transaction.number).toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
        const matchesRecipientStatus = filterRecipientStatus === 'all' || recipient.status === filterRecipientStatus;
        const matchesProduct = filterProduct === 'all' || transaction.metadataProduct.name === filterProduct;

        let matchesDate = true;
        if (filterDate !== 'all') {
            const transactionDate = new Date(transaction.date);
            const today = new Date();

            switch (filterDate) {
                case 'today':
                    matchesDate = transactionDate.toDateString() === today.toDateString();
                    break;
                case 'week': {
                    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
                    matchesDate = transactionDate >= weekAgo;
                    break;
                }
                case 'month': {
                    const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
                    matchesDate = transactionDate >= monthAgo;
                    break;
                }
            }
        }

        return matchesSearch && matchesStatus && matchesProduct && matchesDate && matchesRecipientStatus;
    });

    const handleViewDetails = (transaction: Transaction) => {
        navigate(`/transactions/${transaction.number}`);
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
                    <h1 className='text-3xl font-bold text-gray-800'>Transaksi Subsidi</h1>
                    <p className='text-gray-600 mt-1'>Monitor dan kelola semua transaksi subsidi</p>
                </div>
                <div className='flex gap-3'>
                    <Button variant='secondary'>
                        <Download className='w-4 h-4 mr-2' />
                        Export Excel
                    </Button>
                    <Button variant='secondary'>
                        <FileText className='w-4 h-4 mr-2' />
                        Laporan
                    </Button>
                </div>
            </motion.div>

            {/* Summary Cards */}
            <TransactionSummary />

            {/* Filters */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
                <Card className='p-6'>
                    <div className='flex flex-col lg:flex-row gap-4'>
                        <div className='flex-1 relative'>
                            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
                            <input
                                type='text'
                                placeholder='Cari berdasarkan ID, NIK, atau nama...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent'
                            />
                        </div>
                        <div className='flex gap-3'>
                            <div className='relative'>
                                <select
                                    value={filterDate}
                                    onChange={(e) => setFilterDate(e.target.value)}
                                    className='appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white'
                                >
                                    <option value='all'>Semua Tanggal</option>
                                    <option value='today'>Hari Ini</option>
                                    <option value='week'>7 Hari Terakhir</option>
                                    <option value='month'>30 Hari Terakhir</option>
                                </select>
                                <ChevronDown className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none' />
                            </div>
                            <SelectRecipientStatus value={filterRecipientStatus} onChange={setFilterRecipientStatus} /> 
                            <div className='relative'>
                                <select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    className='appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white'
                                >
                                    <option value='all'>Semua Status</option>
                                    <option value='completed'>Selesai</option>
                                    <option value='pending'>Menunggu</option>
                                    <option value='failed'>Gagal</option>
                                </select>
                                <ChevronDown className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none' />
                            </div>
                        </div>
                    </div>
                </Card>
            </motion.div>

            {/* Transactions Table */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.6 }}>
                <Card className='overflow-hidden'>
                    <div className='overflow-x-auto'>
                        <table className='w-full'>
                            <thead className='bg-gray-50'>
                                <tr>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>ID Transaksi</th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Tanggal</th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Penerima</th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Produk</th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Jumlah</th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Agen</th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Total</th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Status</th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Aksi</th>
                                </tr>
                            </thead>
                            <tbody className='bg-white divide-y divide-gray-200'>
                                {filteredTransactions.map((transaction) => {
                                    const product = transaction.product;
                                    const recipient = transaction.recipient;

                                    return (
                                        <motion.tr
                                            key={transaction.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.3 }}
                                            className='hover:bg-gray-50 transition-colors'
                                        >
                                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>{transaction.number}</td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{formatDate(transaction.date)}</td>
                                            <td className='px-6 py-4 whitespace-nowrap'>
                                                <div>
                                                    <div className='text-sm font-medium text-gray-900'>{recipient?.name}</div>
                                                    <div className='text-sm text-gray-500'>{recipient?.nik}</div>
                                                </div>
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{product?.name}</td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                                                {transaction.qty} {product?.unit}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>{transaction?.merchant?.name}</td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
                                                {formatCurrency(Number(transaction.totalAmount))}
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap'>
                                                <span
                                                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTransactionStatusColor(
                                                        transaction.status
                                                    )}`}
                                                >
                                                    {transaction.status}
                                                </span>
                                            </td>
                                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                                                <button
                                                    onClick={() => handleViewDetails(transaction)}
                                                    className='text-blue-600 hover:text-blue-800 transition-colors'
                                                    title='Lihat Detail'
                                                >
                                                    <Eye className='w-4 h-4' />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default TransactionsPage;
