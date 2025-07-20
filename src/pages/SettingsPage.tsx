import { motion } from 'framer-motion';
import { Bell, Database, DollarSign, FileText, Package, Save, Shield, Users } from 'lucide-react';
import React, { Fragment, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import PrimaryButton from '../components/Buttons/PrimaryButton';
import SecondaryButton from '../components/Buttons/SecondaryButton';
import InputNumber from '../components/Input/InputNumber';
import Card from '../components/UI/Card';
import Modal from '../components/UI/Modal';
import { useProductStore } from '../store/useProductStore';
import { Product } from '../types';

type SettingsType = {
    pricing: Record<string, number>;
    subsidyTypes: Record<string, boolean>;
    quotaLimits: Record<string, number>;
    notifications: {
        emailNotifications: boolean;
        smsNotifications: boolean;
        lowStockAlert: boolean;
        quotaExceededAlert: boolean;
    };
};

const SettingsPage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('pricing');
    const [showLogModal, setShowLogModal] = useState(false);
    const [showActivityModal, setShowActivityModal] = useState(false);

    const [settings, setSettings] = useState<SettingsType>({
        pricing: {},
        subsidyTypes: {},
        quotaLimits: {},
        notifications: {
            emailNotifications: false,
            smsNotifications: false,
            lowStockAlert: false,
            quotaExceededAlert: false,
        },
    });

    const { fetchProducts, updateProduct } = useProductStore();

    const { handleSubmit, reset, register, getValues } = useForm<{ products: Product[] }>({
        defaultValues: {
            products: [],
        },
    });

    const products = useProductStore((state) => state.products);

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (products.length > 0) {
            getData();
        }
    }, [products]);

    const getData = async () => {
        try {
            const lpg = products?.find((p) => p.name.toLowerCase().includes('lpg'));
            const pupuk = products?.find((p) => p.name.toLowerCase().includes('pupuk'));

            const pupukId = pupuk?.id;
            const lpgId = lpg?.id;

            reset({ products: products });

            setSettings({
                pricing: {
                    [`${pupukId}_basePrice` as string]: pupuk?.basePrice || 2500,
                    [`${pupukId}_subsidyPrice` as string]: pupuk?.subsidyPrice || 1000,
                    [`${lpgId}_basePrice` as string]: lpg?.basePrice || 25000,
                    [`${lpgId}_subsidyPrice` as string]: lpg?.subsidyPrice || 3000,
                },
                subsidyTypes: {
                    [`${pupukId}_isActive` as string]: true,
                    [`${lpgId}_isActive` as string]: true,
                },
                quotaLimits: {
                    [`${pupukId}_monthlyQuota` as string]: pupuk?.monthlyQuota || 10,
                    [`${lpgId}_monthlyQuota` as string]: lpg?.monthlyQuota || 5,
                    [`${pupukId}_maxAdditionalQuota` as string]: pupuk?.maxAdditionalQuota || 5,
                    [`${lpgId}_maxAdditionalQuota` as string]: lpg?.maxAdditionalQuota || 5,
                },
                notifications: {
                    emailNotifications: true,
                    smsNotifications: false,
                    lowStockAlert: true,
                    quotaExceededAlert: true,
                },
            });
        } catch (error) {
            console.error('Error fetching data:', error);
            return {};
        }
    };

    const tabs = [
        { id: 'pricing', label: 'Harga & Subsidi', icon: DollarSign },
        { id: 'products', label: 'Jenis Subsidi', icon: Package },
        { id: 'quota', label: 'Batas Kuota', icon: Users },
        { id: 'roles', label: 'Manajemen Role', icon: Shield },
        { id: 'notifications', label: 'Notifikasi', icon: Bell },
        { id: 'system', label: 'Sistem', icon: Database },
    ];

    const systemLogs = [
        {
            id: '1',
            timestamp: '2024-01-15 14:30:25',
            level: 'INFO',
            message: 'User login: admin@subsidi.go.id',
            module: 'AUTH',
        },
        {
            id: '2',
            timestamp: '2024-01-15 14:25:12',
            level: 'WARN',
            message: 'Low stock alert for agent: Kios Makmur Jaya',
            module: 'INVENTORY',
        },
        {
            id: '3',
            timestamp: '2024-01-15 14:20:08',
            level: 'INFO',
            message: 'Transaction completed: TXN001',
            module: 'TRANSACTION',
        },
        {
            id: '4',
            timestamp: '2024-01-15 14:15:45',
            level: 'ERROR',
            message: 'Failed to process payment for TXN002',
            module: 'PAYMENT',
        },
        {
            id: '5',
            timestamp: '2024-01-15 14:10:33',
            level: 'INFO',
            message: 'New recipient added: Budi Santoso',
            module: 'RECIPIENT',
        },
    ];

    const activityLogs = [
        {
            id: '1',
            timestamp: '2024-01-15 14:30:25',
            user: 'Ahmad Subandi',
            action: 'Menambah penerima subsidi baru',
            details: 'NIK: 3402141234567890',
        },
        {
            id: '2',
            timestamp: '2024-01-15 14:25:12',
            user: 'Siti Nurhaliza',
            action: 'Memproses transaksi',
            details: 'TXN001 - Pupuk 25kg',
        },
        {
            id: '3',
            timestamp: '2024-01-15 14:20:08',
            user: 'Ahmad Subandi',
            action: 'Mengubah kuota penerima',
            details: 'Menambah 10kg untuk Budi Santoso',
        },
        {
            id: '4',
            timestamp: '2024-01-15 14:15:45',
            user: 'Budi Prasetyo',
            action: 'Menambah agen baru',
            details: 'Kios Berkah Tani - Sleman',
        },
        {
            id: '5',
            timestamp: '2024-01-15 14:10:33',
            user: 'Ahmad Subandi',
            action: 'Reset kuota bulanan',
            details: 'Reset untuk semua penerima',
        },
    ];

    const handleSave = async () => {
        try {
            await Promise.all(
                getValues('products').map((item: Product) => {
                    const productId = item.id as string;

                    return updateProduct(productId, {
                        name: item.name,
                        basePrice: item.basePrice,
                        subsidyPrice: item.subsidyPrice,
                        price: item.basePrice - item.subsidyPrice,
                        unit: item.unit,
                        monthlyQuota: item.monthlyQuota,
                        maxAdditionalQuota: item.maxAdditionalQuota,
                        needApproval: true,
                    });
                })
            );

            getData();
            toast.success('Berhasil memperbarui data');
        } catch (error) {
            console.error('Error updating products:', error);
            toast.error('Gagal memperbarui data');
        }
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateSetting = (category: string, key: string, value: any) => {
        setSettings((prev) => ({
            ...prev,
            [category]: {
                ...prev[category as keyof typeof prev],
                key: key,
                [key]: value,
            },
        }));
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
        }).format(amount);
    };

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'ERROR':
                return 'text-red-600 bg-red-100';
            case 'WARN':
                return 'text-yellow-600 bg-yellow-100';
            case 'INFO':
                return 'text-blue-600 bg-blue-100';
            default:
                return 'text-gray-600 bg-gray-100';
        }
    };

    const handleBackupDatabase = () => {
        // Simulate backup process
        alert('Backup database dimulai. Anda akan mendapat notifikasi setelah selesai.');
    };

    const handleMaintenanceMode = () => {
        // Simulate maintenance mode
        alert('Mode maintenance diaktifkan. Sistem akan tidak dapat diakses selama maintenance.');
    };

    const handleResetData = () => {
        if (confirm('Apakah Anda yakin ingin mereset semua data testing? Tindakan ini tidak dapat dibatalkan.')) {
            alert('Data testing berhasil direset.');
        }
    };

    const systemSettings = [
        {
            label: 'Backup Database',
            description: 'Backup terakhir: 15 Januari 2024, 02:00',
            buttonLabel: 'Backup Sekarang',
            onClick: handleBackupDatabase,
        },
        {
            label: 'Maintenance Mode',
            description: 'Aktifkan mode maintenance untuk update sistem',
            buttonLabel: 'Aktifkan Maintenance',
            onClick: handleMaintenanceMode,
        },
        {
            label: 'Log Sistem',
            description: 'Lihat dan unduh log aktivitas sistem',
            buttonLabel: 'Lihat Log',
            onClick: () => setShowLogModal(true),
        },
        {
            label: 'Log Aktivitas',
            description: 'Lihat aktivitas pengguna sistem',
            buttonLabel: 'Lihat Aktivitas',
            onClick: () => setShowActivityModal(true),
        },
        {
            label: 'Reset Data',
            description: 'Reset data testing (hanya untuk development)',
            buttonLabel: 'Reset Data',
            onClick: handleResetData,
        },
    ];

    return (
        <form onSubmit={handleSubmit(handleSave)} className='space-y-6'>
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'
            >
                <div>
                    <h1 className='text-3xl font-bold text-gray-800'>Pengaturan Sistem</h1>
                    <p className='text-gray-600 mt-1'>Kelola konfigurasi dan parameter sistem subsidi</p>
                </div>
                <PrimaryButton Icon={Save} type='submit'>
                    Simpan Perubahan
                </PrimaryButton>
            </motion.div>

            <div className='grid grid-cols-1 lg:grid-cols-4 gap-6'>
                {/* Sidebar Tabs */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className='lg:col-span-1'
                >
                    <Card className='p-4'>
                        <nav className='space-y-2'>
                            {tabs.map((tab) => (
                                <button
                                    type='button'
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-xl transition-all duration-200 text-left ${
                                        activeTab === tab.id
                                            ? 'bg-gradient-to-r from-green-100 to-blue-100 text-green-700 shadow-sm'
                                            : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                                    }`}
                                >
                                    <tab.icon className='w-5 h-5' />
                                    <span className='font-medium'>{tab.label}</span>
                                </button>
                            ))}
                        </nav>
                    </Card>
                </motion.div>

                {/* Content Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className='lg:col-span-3'
                >
                    <Card className='p-6'>
                        {/* Pricing & Subsidy Settings */}
                        {activeTab === 'pricing' && (
                            <div className='space-y-6'>
                                <div>
                                    <h2 className='text-xl font-semibold text-gray-800 mb-4'>Pengaturan Harga & Subsidi</h2>
                                    <p className='text-gray-600 mb-6'>Kelola harga dasar dan besaran subsidi untuk setiap produk</p>
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    {products.map((product, index) => {
                                        return (
                                            <div key={product?.id} className='space-y-4'>
                                                <h3 className='text-lg font-medium text-gray-800'>{product?.name}</h3>
                                                <div>
                                                    <InputNumber
                                                        register={register}
                                                        name={`products.${index}.basePrice`}
                                                        label={`Harga Dasar (per ${product?.unit})`}
                                                        value={settings.pricing[product?.id + '_basePrice'] || 0}
                                                        onChange={(value) => updateSetting('pricing', product?.id + '_basePrice', value)}
                                                    />
                                                    <p className='text-xs text-gray-500 mt-1'>
                                                        {formatCurrency(settings.pricing[product?.id + '_basePrice'])}
                                                    </p>
                                                </div>
                                                <div>
                                                    <InputNumber
                                                        register={register}
                                                        name={`products.${index}.subsidyPrice`}
                                                        label={`Besaran Subsidi (per ${product?.unit})`}
                                                        value={settings.pricing[product?.id + '_subsidyPrice'] || 0}
                                                        onChange={(value) => updateSetting('pricing', product?.id + '_subsidyPrice', value)}
                                                    />
                                                    <p className='text-xs text-gray-500 mt-1'>
                                                        {formatCurrency(settings.pricing[product?.id + '_subsidyPrice'])}
                                                    </p>
                                                </div>
                                                <div className='p-3 bg-green-50 rounded-xl'>
                                                    <p className='text-sm text-green-700'>
                                                        <strong>Harga Jual:</strong>{' '}
                                                        {formatCurrency(
                                                            settings.pricing[product?.id + '_basePrice'] -
                                                                settings.pricing[product?.id + '_subsidyPrice']
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Product Types Settings */}
                        {activeTab === 'products' && (
                            <div className='space-y-6'>
                                <div>
                                    <h2 className='text-xl font-semibold text-gray-800 mb-4'>Jenis Subsidi Aktif</h2>
                                    <p className='text-gray-600 mb-6'>Aktifkan atau nonaktifkan jenis subsidi yang tersedia</p>
                                </div>

                                <div className='space-y-4'>
                                    {products.map((product, index) => (
                                        <div key={index} className='flex items-center justify-between p-4 border border-gray-200 rounded-xl'>
                                            <div>
                                                <h3 className='text-lg font-medium text-gray-800'>Subsidi {product?.name}</h3>
                                                {/* <p className='text-sm text-gray-600'>Program subsidi pupuk untuk petani</p> */}
                                            </div>
                                            <label className='relative inline-flex items-center cursor-pointer'>
                                                <input
                                                    type='checkbox'
                                                    name={`products.${index}.isActive`}
                                                    checked={settings.subsidyTypes[product?.id + '_isActive']}
                                                    onChange={(e) => updateSetting('subsidyTypes', product?.id + '_isActive', e.target.checked)}
                                                    className='sr-only peer'
                                                />
                                                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                            </label>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quota Limits Settings */}
                        {activeTab === 'quota' && (
                            <div className='space-y-6'>
                                <div>
                                    <h2 className='text-xl font-semibold text-gray-800 mb-4'>Batas Kuota</h2>
                                    <p className='text-gray-600 mb-6'>Atur batas kuota bulanan dan maksimum penambahan kuota</p>
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    {products.map((product, index) => (
                                        <Fragment key={product.id}>
                                            <div>
                                                <InputNumber
                                                    register={register}
                                                    name={`products.${index}.monthlyQuota`}
                                                    label={`Kuota Bulanan ${product.name} (${product.unit})`}
                                                    // value={settings.quotaLimits[`${product.id}_monthlyQuota`] || 0}
                                                    // onChange={(value) => updateSetting('quotaLimits', `${product.id}_monthlyQuota`, value)}
                                                    rules={{
                                                        onChange: (e) => {
                                                            if (e.target.value < 0) {
                                                                updateSetting('quotaLimits', `${product.id}_monthlyQuota`, e.target.value);
                                                            }
                                                        },
                                                    }}
                                                />
                                            </div>
                                            <div>
                                                <InputNumber
                                                    register={register}
                                                    name={`products.${index}.maxAdditionalQuota`}
                                                    label='Maksimum Penambahan Kuota (%)'
                                                    // value={settings.quotaLimits[`${product.id}_maxAdditionalQuota`] || 0}
                                                    rules={{
                                                        onChange: (e) => {
                                                            if (e.target.value < 0) {
                                                                updateSetting('quotaLimits', `${product.id}_maxAdditionalQuota`, e.target.value);
                                                            }
                                                        },
                                                    }}
                                                />
                                                <p className='text-xs text-gray-500 mt-1'>Maksimum persentase penambahan kuota dari batas normal</p>
                                            </div>
                                        </Fragment>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Role Management */}
                        {activeTab === 'roles' && (
                            <div className='space-y-6'>
                                <div>
                                    <h2 className='text-xl font-semibold text-gray-800 mb-4'>Manajemen Role</h2>
                                    <p className='text-gray-600 mb-6'>Kelola hak akses dan permission untuk setiap role</p>
                                </div>

                                <div className='space-y-4'>
                                    {[
                                        {
                                            role: 'Administrator',
                                            description: 'Akses penuh ke semua fitur sistem',
                                            users: 3,
                                        },
                                        {
                                            role: 'Operator',
                                            description: 'Akses ke manajemen data dan transaksi',
                                            users: 12,
                                        },
                                        {
                                            role: 'Supervisor',
                                            description: 'Akses monitoring dan laporan',
                                            users: 8,
                                        },
                                    ].map((roleData, index) => (
                                        <div key={index} className='flex items-center justify-between p-4 border border-gray-200 rounded-xl'>
                                            <div>
                                                <h3 className='text-lg font-medium text-gray-800'>{roleData.role}</h3>
                                                <p className='text-sm text-gray-600'>{roleData.description}</p>
                                                <p className='text-xs text-gray-500 mt-1'>{roleData.users} pengguna aktif</p>
                                            </div>
                                            <SecondaryButton type='button' size='sm'>Edit Permission</SecondaryButton>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Notifications Settings */}
                        {activeTab === 'notifications' && (
                            <div className='space-y-6'>
                                <div>
                                    <h2 className='text-xl font-semibold text-gray-800 mb-4'>Pengaturan Notifikasi</h2>
                                    <p className='text-gray-600 mb-6'>Atur preferensi notifikasi sistem</p>
                                </div>

                                <div className='space-y-4'>
                                    <div className='flex items-center justify-between p-4 border border-gray-200 rounded-xl'>
                                        <div>
                                            <h3 className='text-lg font-medium text-gray-800'>Notifikasi Email</h3>
                                            <p className='text-sm text-gray-600'>Kirim notifikasi melalui email</p>
                                        </div>
                                        <label className='relative inline-flex items-center cursor-pointer'>
                                            <input
                                                type='checkbox'
                                                checked={settings.notifications.emailNotifications}
                                                onChange={(e) => updateSetting('notifications', 'emailNotifications', e.target.checked)}
                                                className='sr-only peer'
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                                        </label>
                                    </div>

                                    <div className='flex items-center justify-between p-4 border border-gray-200 rounded-xl'>
                                        <div>
                                            <h3 className='text-lg font-medium text-gray-800'>Notifikasi SMS</h3>
                                            <p className='text-sm text-gray-600'>Kirim notifikasi melalui SMS</p>
                                        </div>
                                        <label className='relative inline-flex items-center cursor-pointer'>
                                            <input
                                                type='checkbox'
                                                checked={settings.notifications.smsNotifications}
                                                onChange={(e) => updateSetting('notifications', 'smsNotifications', e.target.checked)}
                                                className='sr-only peer'
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                                        </label>
                                    </div>

                                    <div className='flex items-center justify-between p-4 border border-gray-200 rounded-xl'>
                                        <div>
                                            <h3 className='text-lg font-medium text-gray-800'>Alert Stok Rendah</h3>
                                            <p className='text-sm text-gray-600'>Notifikasi ketika stok agen rendah</p>
                                        </div>
                                        <label className='relative inline-flex items-center cursor-pointer'>
                                            <input
                                                type='checkbox'
                                                checked={settings.notifications.lowStockAlert}
                                                onChange={(e) => updateSetting('notifications', 'lowStockAlert', e.target.checked)}
                                                className='sr-only peer'
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-600"></div>
                                        </label>
                                    </div>

                                    <div className='flex items-center justify-between p-4 border border-gray-200 rounded-xl'>
                                        <div>
                                            <h3 className='text-lg font-medium text-gray-800'>Alert Kuota Terlampaui</h3>
                                            <p className='text-sm text-gray-600'>Notifikasi ketika kuota penerima terlampaui</p>
                                        </div>
                                        <label className='relative inline-flex items-center cursor-pointer'>
                                            <input
                                                type='checkbox'
                                                checked={settings.notifications.quotaExceededAlert}
                                                onChange={(e) => updateSetting('notifications', 'quotaExceededAlert', e.target.checked)}
                                                className='sr-only peer'
                                            />
                                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
                                        </label>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* System Settings */}
                        {activeTab === 'system' && (
                            <div className='space-y-6'>
                                <div>
                                    <h2 className='text-xl font-semibold text-gray-800 mb-4'>Pengaturan Sistem</h2>
                                    <p className='text-gray-600 mb-6'>Konfigurasi sistem dan maintenance</p>
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    {systemSettings.map((setting, index) => (
                                        <Card className='p-4' key={index}>
                                            <h3 className='text-lg font-medium text-gray-800 mb-2'>{setting.label}</h3>
                                            <p className='text-sm text-gray-600 mb-4'>{setting.description}</p>
                                            <SecondaryButton type='button' size='sm' onClick={setting.onClick}>
                                                {setting.buttonLabel}
                                            </SecondaryButton>
                                        </Card>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>
                </motion.div>
            </div>

            {/* System Log Modal */}
            <Modal isOpen={showLogModal} onClose={() => setShowLogModal(false)} title='Log Sistem' size='xl'>
                <div className='space-y-4'>
                    <div className='flex justify-between items-center'>
                        <p className='text-sm text-gray-600'>Menampilkan 100 log terbaru</p>
                        <SecondaryButton type='button' Icon={FileText} size='sm'>
                            Download Log
                        </SecondaryButton>
                    </div>
                    <div className='max-h-96 overflow-y-auto'>
                        <table className='w-full text-sm'>
                            <thead className='bg-gray-50 sticky top-0'>
                                <tr>
                                    <th className='px-4 py-2 text-left'>Timestamp</th>
                                    <th className='px-4 py-2 text-left'>Level</th>
                                    <th className='px-4 py-2 text-left'>Module</th>
                                    <th className='px-4 py-2 text-left'>Message</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-gray-200'>
                                {systemLogs.map((log) => (
                                    <tr key={log.id} className='hover:bg-gray-50'>
                                        <td className='px-4 py-2 text-gray-600'>{log.timestamp}</td>
                                        <td className='px-4 py-2'>
                                            <span className={`px-2 py-1 text-xs rounded-full ${getLevelColor(log.level)}`}>{log.level}</span>
                                        </td>
                                        <td className='px-4 py-2 text-gray-600'>{log.module}</td>
                                        <td className='px-4 py-2 text-gray-800'>{log.message}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </Modal>

            {/* Activity Log Modal */}
            <Modal isOpen={showActivityModal} onClose={() => setShowActivityModal(false)} title='Log Aktivitas Pengguna' size='xl'>
                <div className='space-y-4'>
                    <div className='flex justify-between items-center'>
                        <p className='text-sm text-gray-600'>Menampilkan aktivitas 24 jam terakhir</p>
                        <SecondaryButton type='button' Icon={FileText} size='sm'>
                            Download Log
                        </SecondaryButton>
                    </div>
                    <div className='max-h-96 overflow-y-auto'>
                        <div className='space-y-3'>
                            {activityLogs.map((activity) => (
                                <div key={activity.id} className='p-4 border border-gray-200 rounded-xl hover:bg-gray-50'>
                                    <div className='flex items-start justify-between'>
                                        <div className='flex-1'>
                                            <div className='flex items-center space-x-2 mb-1'>
                                                <span className='font-medium text-gray-800'>{activity.user}</span>
                                                <span className='text-sm text-gray-500'>{activity.timestamp}</span>
                                            </div>
                                            <p className='text-sm text-gray-700 mb-1'>{activity.action}</p>
                                            <p className='text-xs text-gray-500'>{activity.details}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Modal>
        </form>
    );
};

export default SettingsPage;
