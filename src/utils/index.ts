import _ from 'lodash';
import { CheckCircle, Clock, DollarSign, FileText, TrendingDown, TrendingUp, XCircle } from 'lucide-react';
import { Classification, TransactionStatus } from './enums';
import { homeOwnershipOptions, recipientStatus } from './options';

export const getStatusColor = (status: boolean) => {
    switch (status) {
        case true:
            return 'bg-green-100 text-green-800';
        case false:
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export const getClassificationColor = (classification: string) => {
    switch (classification) {
        case Classification.Kurang_Mampu:
            return 'bg-red-100 text-red-800';
        case Classification.Menengah:
            return 'bg-yellow-100 text-yellow-800';
        case Classification.Mampu:
            return 'bg-green-100 text-green-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export const getClassificationLabel = (classification: string) => {
    switch (classification) {
        case Classification.Kurang_Mampu:
            return 'Kurang Mampu';
        case Classification.Menengah:
            return 'Menengah';
        case Classification.Mampu:
            return 'Mampu';
        default:
            return '-';
    }
};

export const getRecipientStatusColor = (status: string) => {
    switch (status) {
        case 'Aktif':
            return 'bg-green-100 text-green-800';
        case 'Ditangguhkan':
            return 'bg-gray-100 text-gray-800';
        case 'Tidak_Aktif':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export const getTransactionStatusColor = (status: string) => {
    switch (status) {
        case 'Selesai':
            return 'bg-green-100 text-green-800';
        case 'Menunggu':
            return 'bg-yellow-100 text-yellow-800';
        case 'Gagal':
            return 'bg-red-100 text-red-800';
        default:
            return 'bg-gray-100 text-gray-800';
    }
};

export const getRecipientStatusLabel = (status: string) => {
    return recipientStatus.find((item) => item.value === status)?.label || '-';
}

export const getClassificationIcon = (classification: string) => {
    switch (classification) {
        case Classification.Kurang_Mampu:
            return TrendingDown;
        case Classification.Menengah:
            return DollarSign;
        case Classification.Mampu:
            return TrendingUp;
        default:
            return DollarSign;
    }
};

export const getTransactionStatusIcon = (status: string) => {
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

export const getStockStatus = (current: number, capacity: number) => {
    const percentage = (current / capacity) * 100;
    if (percentage <= 20) return { color: 'bg-red-500', text: 'Stok Rendah' };
    if (percentage <= 50) return { color: 'bg-yellow-500', text: 'Stok Sedang' };
    return { color: 'bg-green-500', text: 'Stok Cukup' };
};

export const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
    }).format(amount);

export const formatDate = (dateString: string) => {
    const date = new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    return date !== 'Invalid Date' ? date : '-';
};

export const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
};

export const returnInitial = (fullName: string) => {
    const names = fullName.trim().split(' ');
    const firstInitial = names[0]?.[0] || '';
    const lastInitial = names[names.length - 1]?.[0] || '';
    return `${firstInitial}${lastInitial}`;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const generateOptions = (data: any[], nameKey: string | string[], valueKey: string, isFormatted: boolean = false) => {
    if (!Array.isArray(data) || _.isEmpty(data)) return [];

    return data.map((item) => {
        const label = isFormatted
            ? Array.isArray(nameKey)
                ? nameKey.map((key, i) => (i !== 0 ? ` | ${_.get(item, key, '-') ?? '-'}` : _.get(item, key, '-'))).join('')
                : '-'
            : _.get(item, nameKey as string, '-');

        return {
            label,
            value: _.get(item, valueKey)?.toString(),
        };
    }) as { label: string; value: string }[];
};

export const getHomeOwnershipLabel = (value: string) => {
    return homeOwnershipOptions.find((option) => option.value === value)?.label || '';
};
