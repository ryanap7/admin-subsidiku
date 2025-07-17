import { DollarSign, Eye, Plus, TrendingDown, TrendingUp } from 'lucide-react';
import React, { useEffect } from 'react';
import { useRecipientStore } from '../../../store/useRecipientStore';
import SummaryCard from '../../UI/SummaryCard';

const RecipientSummary: React.FC = () => {
    const { recipientStatistics, fetchRecipientStatistics } = useRecipientStore();

    useEffect(() => {
        fetchRecipientStatistics();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const totalRecipients = recipientStatistics?.totalRecipient || 0;
    const activeRecipients = recipientStatistics?.activeRecipient || 0;
    const poorRecipients = recipientStatistics?.kurangMampu || 0;
    const middleRecipients = recipientStatistics?.menengah || 0;
    const richRecipients = recipientStatistics?.mampu || 0;

    return (
        <div className='grid grid-cols-1 md:grid-cols-5 gap-6'>
            <SummaryCard
                title='Total Penerima'
                value={totalRecipients.toLocaleString()}
                icon={Plus}
                iconBgClassName='bg-blue-100'
                iconClassName='text-blue-600'
                subText='+5.2% dari bulan lalu'
                subTextClassName='text-xs text-green-600 mt-1'
            />
            <SummaryCard
                title='Kurang Mampu'
                value={poorRecipients.toLocaleString()}
                valueClassName='text-red-600'
                icon={TrendingDown}
                iconBgClassName='bg-red-100'
                iconClassName='text-red-600'
                subText={`${((poorRecipients / totalRecipients) * 100).toFixed(1)}% dari total`}
                subTextClassName='text-xs text-gray-500 mt-1'
            />
            <SummaryCard
                title='Menengah'
                value={middleRecipients.toLocaleString()}
                valueClassName='text-yellow-600'
                icon={DollarSign}
                iconBgClassName='bg-yellow-100'
                iconClassName='text-yellow-600'
                subText={`${((middleRecipients / totalRecipients) * 100).toFixed(1)}% dari total`}
                subTextClassName='text-xs text-gray-500 mt-1'
            />
            <SummaryCard
                title='Mampu'
                value={richRecipients.toLocaleString()}
                valueClassName='text-green-600'
                icon={TrendingUp}
                iconBgClassName='bg-green-100'
                iconClassName='text-green-600'
                subText={`${((richRecipients / totalRecipients) * 100).toFixed(1)}% dari total`}
                subTextClassName='text-xs text-gray-500 mt-1'
            />
            <SummaryCard
                title='Penerima Aktif'
                value={activeRecipients.toLocaleString()}
                valueClassName='text-blue-600'
                icon={Eye}
                iconBgClassName='bg-blue-100'
                iconClassName='text-blue-600'
                subText={`${((activeRecipients / totalRecipients) * 100).toFixed(1)}% dari total`}
                subTextClassName='text-xs text-gray-500 mt-1'
            />
        </div>
    );
};

export default RecipientSummary;
