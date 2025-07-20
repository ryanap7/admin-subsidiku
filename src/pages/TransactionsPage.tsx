import { motion } from 'framer-motion';
import { Download, Eye, FileText } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SecondaryButton from '../components/Buttons/SecondaryButton';
import SearchInput from '../components/Input/SearchInput';
import TransactionSummary from '../components/Modules/Transaction/TransactionSummary';
import FilterSelection from '../components/Select/FilterSelection';
import Card from '../components/UI/Card';
import PageHeader from '../components/UI/PageHeader';
import { useTransactionStore } from '../store/useTransactionStore';
import { Recipient, Transaction } from '../types';
import { formatCurrency, formatDate, getTransactionStatusColor } from '../utils';
import { dateFilterOptions, recipientStatus, transactionStatusOptions } from '../utils/options';

const TransactionsPage: React.FC = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterRecipientStatus, setFilterRecipientStatus] = useState('all');
    const [filterDate, setFilterDate] = useState('all');

    const { transactions, fetchTransactions } = useTransactionStore();

    useEffect(() => {
        fetchTransactions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const filteredTransactions = transactions.filter((transaction) => {
        const recipient = transaction.metadataRecipient as Recipient;

        const matchesSearch =
            recipient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            recipient?.nik.includes(searchTerm) ||
            String(transaction.number).toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
        const matchesRecipientStatus = filterRecipientStatus === 'all' || recipient.status === filterRecipientStatus;

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

        return matchesSearch && matchesStatus && matchesDate && matchesRecipientStatus;
    });

    const handleViewDetails = (transaction: Transaction) => {
        navigate(`/transactions/${transaction.number}`);
    };

    return (
        <div className='space-y-6'>
            {/* Header */}
            <PageHeader title='Transaksi Subsidi' description='Monitor dan kelola semua transaksi subsidi'>
                <div className='flex gap-3'>
                    <SecondaryButton Icon={Download}>Export Excel</SecondaryButton>
                    <SecondaryButton Icon={FileText}>Laporan</SecondaryButton>
                </div>
            </PageHeader>

            {/* Summary Cards */}
            <TransactionSummary />

            {/* Filters */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.5 }}>
                <Card className='p-6'>
                    <div className='flex flex-col lg:flex-row gap-4'>
                        <SearchInput
                            placeholder='Cari berdasarkan ID, NIK, atau nama...'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div className='flex gap-3'>
                            <FilterSelection options={dateFilterOptions} value={filterDate} onChange={(e) => setFilterDate(e.target.value)} />
                            <FilterSelection
                                options={[{ value: 'all', label: 'Semua Penerima' }, ...recipientStatus]}
                                value={filterRecipientStatus}
                                onChange={(e) => setFilterRecipientStatus(e.target.value)}
                            />
                            <FilterSelection
                                options={[{ value: 'all', label: 'Semua Status' }, ...transactionStatusOptions]}
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            />
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
