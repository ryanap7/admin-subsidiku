import { Recipient, Transaction } from '../../../types';
import { formatCurrency, formatDateTime } from '../../../utils';
import PrimaryButton from '../../Buttons/PrimaryButton';
import SecondaryButton from '../../Buttons/SecondaryButton';
import Modal from '../../UI/Modal';

export default function TransactionRecipeModal({
    isOpen,
    onClose,
    transaction,
    recipient,
}: {
    isOpen: boolean;
    onClose: () => void;
    transaction: Transaction;
    recipient: Recipient;
}) {
    const content = [
        { label: 'ID Transaksi', value: transaction?.number },
        { label: 'Tanggal & Waktu', value: formatDateTime(transaction?.date) },
        { label: 'Status', value: transaction?.status },
        { label: 'NIK', value: recipient?.nik },
        { label: 'Nama', value: recipient?.name },
    ];

    const renderContent = (label: string, content: { label: string; value: string }[]) => {
        return (
            <div>
                <h3 className='font-semibold text-gray-800 mb-3'>{label}</h3>
                <div className='space-y-2 text-sm'>
                    {content?.map((item, index) => (
                        <div key={index} className='flex justify-between'>
                            <span>{item.label}:</span>
                            <span className='font-medium'>{item.value}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title='Cetak Bukti Transaksi' size='lg'>
            <div className='space-y-6'>
                <div className='text-center border-b pb-4'>
                    <h2 className='text-xl font-bold text-gray-800'>BUKTI TRANSAKSI SUBSIDI</h2>
                    <p className='text-sm text-gray-600'>Kementerian Pertanian Republik Indonesia</p>
                </div>

                <div className='grid grid-cols-2 gap-6'>
                    {renderContent('Informasi Transaksi', content.slice(0, 4))}
                    {renderContent('Informasi Penerima', content.slice(4, 5))}
                </div>

                <div>
                    <h3 className='font-semibold text-gray-800 mb-3'>Detail Produk</h3>
                    <div className='bg-gray-50 p-4 rounded-xl'>
                        <div className='flex justify-between items-center'>
                            <div>
                                <p className='font-medium capitalize'>{transaction?.product?.name}</p>
                                <p className='text-sm text-gray-600'>
                                    {transaction?.qty} {transaction?.product?.unit}
                                </p>
                            </div>
                            <div className='text-right'>
                                <p className='font-bold text-lg'>{formatCurrency(transaction?.totalAmount)}</p>
                                <p className='text-sm text-gray-600'>Setelah subsidi</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='text-center text-xs text-gray-500 border-t pt-4'>
                    <p>Dokumen ini dicetak pada {new Date().toLocaleDateString('id-ID')}</p>
                    <p>Untuk informasi lebih lanjut hubungi call center: 1500-123</p>
                </div>

                <div className='flex justify-end space-x-3'>
                    <SecondaryButton onClick={onClose}>Tutup</SecondaryButton>
                    <PrimaryButton onClick={() => window.print()}>Cetak</PrimaryButton> 
                </div>
            </div>
        </Modal>
    );
}
