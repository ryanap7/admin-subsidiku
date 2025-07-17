import { AlertCircle, Clock, DollarSign, FileText, Package, Store, TrendingDown, TrendingUp, Users } from 'lucide-react';
import SummaryCard from '../../UI/SummaryCard';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function DashboardSummaryCard({data}: any) {
    const { recipient, transaction, merchant } = data;

    const stats = [
        {
            title: 'Total Penerima Subsidi Aktif',
            value: recipient?.activeRecipient,
            subText: '+5.2%',
            trend: 'up',
            icon: Users,
            color: 'from-green-400 to-green-600',
        },
        {
            title: 'Total Agen Terdaftar',
            value: merchant?.totalMerchant,
            subText: '+2.1%',
            trend: 'up',
            icon: Store,
            color: 'from-blue-400 to-blue-600',
        },
        {
            title: 'Total Transaksi Bulan Ini',
            value: transaction?.totalTransactions,
            subText: '+12.8%',
            trend: 'up',
            icon: FileText,
            color: 'from-purple-400 to-purple-600',
        },
        {
            title: 'Total Subsidi Disalurkan',
            value: recipient?.totalRecipient,
            subText: '+8.7%',
            trend: 'up',
            icon: DollarSign,
            color: 'from-orange-400 to-orange-600',
        },
    ];

    const additionalStats = [
        {
            title: 'Stok Rendah',
            value: '12',
            subText: 'Agen dengan stok < 20%',
            icon: AlertCircle,
            color: 'text-red-600',
            bgColor: 'bg-red-100',
        },
        {
            title: 'Transaksi Pending',
            value: '34',
            subText: 'Menunggu persetujuan',
            icon: Clock,
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-100',
        },
        {
            title: 'Pengaduan Aktif',
            value: '8',
            subText: 'Perlu tindak lanjut',
            icon: FileText,
            color: 'text-blue-600',
            bgColor: 'bg-blue-100',
        },
        {
            title: 'Kuota Terpakai',
            value: '78%',
            subText: 'Dari total kuota bulanan',
            icon: Package,
            color: 'text-green-600',
            bgColor: 'bg-green-100',
        },
    ];

    return (
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
            {stats.map((stat, index) => (
                <SummaryCard
                    key={index}
                    title={stat.title}
                    value={stat.value}
                    subText={
                        <div className='flex items-center mt-2'>
                            {stat.trend === 'up' ? (
                                <TrendingUp className='w-4 h-4 text-green-500 mr-1' />
                            ) : (
                                <TrendingDown className='w-4 h-4 text-red-500 mr-1' />
                            )}
                            <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>{stat.subText}</span>
                        </div>
                    }
                    icon={stat.icon}
                    iconBgClassName={`bg-gradient-to-br ${stat.color}`}
                    iconClassName='text-white'
                />
            ))}
            {additionalStats.map((stat, index) => (
                <SummaryCard
                    key={`additional-${index}`}
                    title={stat.title}
                    value={stat.value}
                    subText={stat.subText}
                    icon={stat.icon}
                    iconBgClassName={stat.bgColor}
                    iconClassName={stat.color}
                />
            ))}
        </div>
    );
}

export default DashboardSummaryCard;
