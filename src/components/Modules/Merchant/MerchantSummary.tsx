import { AlertCircle, Package, Package2, Store } from 'lucide-react';
import React, { useEffect } from 'react';
import { useMerchantStore } from '../../../store/useMerchantStore';
import SummaryCard from '../../UI/SummaryCard';

const MerchantSummary: React.FC = () => {
    const { merchantStatistics, fetchMerchantStatistics } = useMerchantStore();

    useEffect(() => {
        fetchMerchantStatistics();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const totalMerchants = merchantStatistics?.totalMerchant || 0;
    const activeMerchants = merchantStatistics?.activeMerchant || 0;
    const totalCapacity = merchantStatistics?.totalCapacity || 0;

    return (
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
            <SummaryCard
                title='Total Agen'
                value={totalMerchants.toLocaleString('id-ID')}
                icon={Store}
                iconBgClassName='bg-blue-100'
                iconClassName='text-blue-600'
            />
            <SummaryCard
                title='Agen Aktif'
                value={activeMerchants.toLocaleString('id-ID')}
                icon={Package}
                iconBgClassName='bg-green-100'
                iconClassName='text-green-600'
            />
            <SummaryCard
                title='Stok Rendah'
                value={0} // dummy
                icon={AlertCircle}
                iconBgClassName='bg-red-100'
                iconClassName='text-red-600'
            />
            <SummaryCard
                title='Kapasitas Total'
                value={totalCapacity.toLocaleString('id-ID')}
                icon={Package2}
                iconBgClassName='bg-purple-100'
                iconClassName='text-purple-600'
            />
        </div>
    );
};

export default MerchantSummary;
