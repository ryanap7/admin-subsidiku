import { Classification, HomeOwnership, TransactionStatus } from './enums';

export const homeOwnershipOptions = [
    { label: 'Milik Sendiri', value: HomeOwnership.Owned },
    { label: 'Sewa', value: HomeOwnership.Rented },
    { label: 'Milik Keluarga', value: HomeOwnership.Family },
];

export const classificationOptions = [
    { label: 'Mampu', value: Classification.Mampu },
    { label: 'Menengah', value: Classification.Menengah },
    { label: 'Kurang Mampu', value: Classification.Kurang_Mampu },
];

export const booleanOptions = [
    { label: 'Ya', value: 'true' },
    { label: 'Tidak', value: 'false' },
]; 

export const statusOptions = [
    { label: 'Aktif', value: 'Aktif' },
    { label: 'Tidak Aktif', value: 'Tidak Aktif' },
]; 

export const recipientStatus = [
    { label: 'Aktif', value: 'Aktif' },
    { label: 'Tidak Aktif', value: 'Tidak_Aktif' },
    { label: 'Ditangguhkan', value: 'Ditangguhkan' },
]; 

 export const districtOptions = [
    { label: 'Bantul', value: 'Bantul' },
    { label: 'Sleman', value: 'Sleman' },
    { label: 'Kulon Progo', value: 'Kulon Progo' },
    { label: 'Gunung Kidul', value: 'Gunung Kidul' },
    { label: 'Yogyakarta', value: 'Yogyakarta' },
]; 

export const dateFilterOptions = [
    { label: 'Semua Tanggal', value: 'all' },
    { label: 'Hari Ini', value: 'today' },
    { label: '7 Hari Terakhir', value: 'week' },
    { label: '30 Hari Terakhir', value: 'month' },
];

export const transactionStatusOptions = [
    { label: 'Selesai', value: TransactionStatus.Selesai },
    { label: 'Menunggu', value: TransactionStatus.Menunggu },
    { label: 'Gagal', value: TransactionStatus.Gagal },
];

