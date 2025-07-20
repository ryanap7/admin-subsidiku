import { format } from 'date-fns';
import { motion } from 'framer-motion';
import _ from 'lodash';
import React, { useEffect } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import DashboardSummaryCard from '../components/Modules/Dashboard/DashboardSummaryCard';
import Button from '../components/UI/Button';
import Card from '../components/UI/Card';
import { useMerchantStore } from '../store/useMerchantStore';
import { useProductStore } from '../store/useProductStore';
import { useRecipientStore } from '../store/useRecipientStore';
import { useTransactionStore } from '../store/useTransactionStore';
import { Subsidy } from '../types';

const DashboardPage: React.FC = () => {
    const { fetchTransactionStatistics, transactionStatistics, fetchTransactions, transactions } = useTransactionStore();
    const { fetchRecipientStatistics, recipientStatistics, fetchRecipients, recipients } = useRecipientStore();
    const { fetchMerchantStatistics, merchantStatistics } = useMerchantStore();
    const { fetchProducts, products } = useProductStore();

    const barData = [
        { name: 'Bantul', pupuk: 1240, LPG: 890 },
        { name: 'Sleman', pupuk: 1890, LPG: 1340 },
        { name: 'Kulon Progo', pupuk: 980, LPG: 760 },
        { name: 'Gunung Kidul', pupuk: 1560, LPG: 1120 },
        { name: 'Yogyakarta', pupuk: 2340, LPG: 1890 },
    ];

    const pieData = [
        {
            name: products[0]?.name,
            value: getPercentage(0),
            color: '#10B981',
        },
        { name: products[1]?.name, value: getPercentage(1), color: '#3B82F6' },
    ];

    const MONTHS: string[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    function calculateTrendData(data) {
        const grouped = new Map<string, { transaksi: number; subsidi: number }>();

        data.forEach((item) => {
            const monthKey = format(new Date(item.date), 'MMM');
            const transaksi = item.price * item.qty;
            const subsidi = (item.basePrice - item.price) * item.qty;

            if (!grouped.has(monthKey)) {
                grouped.set(monthKey, { transaksi: 0, subsidi: 0 });
            }

            const current = grouped.get(monthKey)!;
            current.transaksi += transaksi;
            current.subsidi += subsidi;
        });

        return MONTHS.map((month) => {
            const values = grouped.get(month) ?? { transaksi: 0, subsidi: 0 };
            return {
                month,
                transaksi: values.transaksi,
                subsidi: parseFloat((values.subsidi / 1000).toFixed(1)),
            };
        });
    } 
    

    const distributionData = [
        { wilayah: 'Bantul', penerima: 3200, persentase: 25 },
        { wilayah: 'Sleman', penerima: 2800, persentase: 22 },
        { wilayah: 'Kulon Progo', penerima: 2100, persentase: 16 },
        { wilayah: 'Gunung Kidul', penerima: 2400, persentase: 19 },
        { wilayah: 'Yogyakarta', penerima: 2347, persentase: 18 },
    ];

    useEffect(() => {
        fetchTransactionStatistics();
        fetchMerchantStatistics();
        fetchRecipientStatistics();
        fetchProducts();
        fetchRecipients();
        fetchTransactions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    function getPercentage(index: number) {
        const totalSubsidies = _.sum(recipients[index]?.subsidies?.map((s) => s.remainingQuota));
        const filtered = recipients[index]?.subsidies?.filter((s: Subsidy) => s.product?.name === products[index]?.name);
        const percentage = (_.sum(filtered?.map((item: Subsidy) => item.remainingQuota)) / totalSubsidies) * 100;

        return Math.round(percentage);
    } 

    return (
        <div className='space-y-6'>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='flex items-center justify-between'
            >
                <div>
                    <h1 className='text-3xl font-bold text-gray-800'>Dashboard</h1>
                    <p className='text-gray-600 mt-1'>Selamat datang di panel admin SubsidiKu</p>
                </div>
                <Button variant='primary'>Unduh Laporan</Button>
            </motion.div>

            {/* Main Stats Cards */}
            <DashboardSummaryCard data={{ recipient: recipientStatistics, transaction: transactionStatistics, merchant: merchantStatistics }} />

            {/* Charts Section */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Bar Chart */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.8 }}>
                    <Card className='p-6'>
                        <div className='flex items-center justify-between mb-6'>
                            <h3 className='text-lg font-semibold text-gray-800'>Pemakaian Subsidi per Kabupaten</h3>
                            <Button variant='secondary' size='sm'>
                                Lihat Detail
                            </Button>
                        </div>
                        <ResponsiveContainer width='100%' height={300}>
                            <BarChart data={barData}>
                                <CartesianGrid strokeDasharray='3 3' />
                                <XAxis dataKey='name' />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey='pupuk' fill='#10B981' radius={[4, 4, 0, 0]} />
                                <Bar dataKey='LPG' fill='#3B82F6' radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </Card>
                </motion.div>

                {/* Pie Chart */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.9 }}>
                    <Card className='p-6'>
                        <div className='flex items-center justify-between mb-6'>
                            <h3 className='text-lg font-semibold text-gray-800'>Komposisi Jenis Subsidi</h3>
                        </div>
                        <ResponsiveContainer width='100%' height={300}>
                            <PieChart>
                                <Pie data={pieData} cx='50%' cy='50%' innerRadius={60} outerRadius={100} paddingAngle={5} dataKey='value'>
                                    {pieData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className='mt-4 space-y-2'>
                            {pieData.map((entry, index) => (
                                <div key={index} className='flex items-center justify-between'>
                                    <div className='flex items-center'>
                                        <div className='w-3 h-3 rounded-full mr-2' style={{ backgroundColor: entry.color }} />
                                        <span className='text-sm text-gray-600'>{entry.name}</span>
                                    </div>
                                    <span className='text-sm font-medium text-gray-800'>{entry.value}%</span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Trend Analysis */}
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-6'>
                {/* Transaction Trend */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.0 }}>
                    <Card className='p-6'>
                        <h3 className='text-lg font-semibold text-gray-800 mb-6'>Tren Transaksi 6 Bulan Terakhir</h3>
                        <ResponsiveContainer width='100%' height={250}>
                            <LineChart data={calculateTrendData(transactions)}>
                                <CartesianGrid strokeDasharray='3 3' />
                                <XAxis dataKey='month' />
                                <YAxis />
                                <Tooltip />
                                <Line type='monotone' dataKey='transaksi' stroke='#10B981' strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </Card>
                </motion.div>

                {/* Distribution by Region */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.1 }}>
                    <Card className='p-6'>
                        <h3 className='text-lg font-semibold text-gray-800 mb-6'>Distribusi Penerima per Wilayah</h3>
                        <div className='space-y-4'>
                            {distributionData.map((item, index) => (
                                <div key={index} className='flex items-center justify-between'>
                                    <div className='flex items-center space-x-3'>
                                        <div className='w-3 h-3 bg-green-500 rounded-full'></div>
                                        <span className='text-sm font-medium text-gray-700'>{item.wilayah}</span>
                                    </div>
                                    <div className='flex items-center space-x-3'>
                                        <div className='w-24 bg-gray-200 rounded-full h-2'>
                                            <div className='bg-green-500 h-2 rounded-full' style={{ width: `${item.persentase}%` }}></div>
                                        </div>
                                        <span className='text-sm text-gray-600 w-12 text-right'>{item.penerima}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </motion.div>
            </div>

            {/* Recent Activity */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 1.2 }}>
                <Card className='p-6'>
                    <h3 className='text-lg font-semibold text-gray-800 mb-4'>Aktivitas Terbaru</h3>
                    <div className='space-y-4'>
                        {[
                            {
                                action: 'Penerima baru ditambahkan',
                                user: 'Budi Santoso',
                                time: '5 menit yang lalu',
                                type: 'success',
                            },
                            {
                                action: 'Kuota bulanan direset',
                                user: 'Sistem',
                                time: '1 jam yang lalu',
                                type: 'info',
                            },
                            {
                                action: 'Transaksi pupuk berhasil',
                                user: 'Siti Aminah',
                                time: '2 jam yang lalu',
                                type: 'success',
                            },
                            {
                                action: 'Agen baru terdaftar',
                                user: 'Kios Makmur',
                                time: '3 jam yang lalu',
                                type: 'info',
                            },
                            {
                                action: 'Pengaduan baru diterima',
                                user: 'Ahmad Wijaya',
                                time: '4 jam yang lalu',
                                type: 'warning',
                            },
                        ].map((activity, index) => (
                            <div key={index} className='flex items-center justify-between p-3 bg-gray-50 rounded-xl'>
                                <div className='flex items-center space-x-3'>
                                    <div
                                        className={`w-2 h-2 rounded-full ${
                                            activity.type === 'success'
                                                ? 'bg-green-500'
                                                : activity.type === 'warning'
                                                ? 'bg-yellow-500'
                                                : 'bg-blue-500'
                                        }`}
                                    ></div>
                                    <div>
                                        <p className='text-sm font-medium text-gray-800'>{activity.action}</p>
                                        <p className='text-xs text-gray-600'>{activity.user}</p>
                                    </div>
                                </div>
                                <span className='text-xs text-gray-500'>{activity.time}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default DashboardPage;
