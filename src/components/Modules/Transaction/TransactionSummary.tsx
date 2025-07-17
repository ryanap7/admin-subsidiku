import { FileCheck, FileClock, FileText, FileX } from 'lucide-react';
import React, { useEffect } from 'react';
import { useTransactionStore } from '../../../store/useTransactionStore';
import SummaryCard from '../../UI/SummaryCard';

const TransactionSummary: React.FC = () => {
    const { transactionStatistics, fetchTransactionStatistics } = useTransactionStore();

    useEffect(() => {
        fetchTransactionStatistics();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const totalTransactions = transactionStatistics?.totalTransactions || 0;
    const successTransactions = transactionStatistics?.successTransactions || 0;
    const pendingTransactions = transactionStatistics?.pendingTransactions || 0;
    const canceledTransactions = transactionStatistics?.canceledTransactions || 0;

    const successTransactionsPercentage = ((successTransactions / totalTransactions) * 100).toFixed(1);
    const canceledTransactionPercentage = ((canceledTransactions / totalTransactions) * 100).toFixed(1);

    return (
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
            <SummaryCard
                title='Total Transaksi'
                value={totalTransactions.toLocaleString('id-ID')}
                icon={FileText}
                iconBgClassName='bg-blue-100'
                iconClassName='text-blue-600'
                subText={`+12% dari bulan lalu`}
                subTextClassName='text-xs text-green-600 mt-1'
            />
            <SummaryCard
                title='Transaksi Selesai'
                value={successTransactions.toLocaleString('id-ID')}
                valueClassName='text-green-600'
                icon={FileCheck}
                iconBgClassName='bg-green-100'
                iconClassName='text-green-600'
                subText={`${successTransactionsPercentage}% success rate`}
                subTextClassName='text-xs text-gray-500 mt-1'
            />
            <SummaryCard
                title='Menunggu Proses'
                value={pendingTransactions.toLocaleString('id-ID')}
                valueClassName='text-yellow-600'
                icon={FileClock}
                iconBgClassName='bg-yellow-100'
                iconClassName='text-yellow-600'
                subText={`Perlu tindak lanjut`}
                subTextClassName='text-xs text-gray-500 mt-1'
            />
            <SummaryCard
                title='Transaksi Gagal'
                value={canceledTransactions.toLocaleString('id-ID')}
                valueClassName='text-red-600'
                icon={FileX}
                iconBgClassName='bg-red-100'
                iconClassName='text-red-600'
                subText={`${canceledTransactionPercentage}% failure rate`}
                subTextClassName='text-xs text-gray-500 mt-1'
            />
        </div>
    );
};

export default TransactionSummary;
