import Button from './Button';
import Modal from './Modal';

interface ConfirmModalProps {
    isOpen: boolean;
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
}

export default function ConfirmModal({
    isOpen,
    title = 'Konfirmasi',
    message,
    confirmText = 'Ya, Lanjutkan',
    cancelText = 'Batal',
    onClose,
    onConfirm,
    loading = false,
}: ConfirmModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <p className='text-sm text-gray-700'>{message}</p>
            <div className='flex justify-end space-x-3 pt-6'>
                <Button variant='secondary' onClick={onClose} disabled={loading}>
                    {cancelText}
                </Button>
                <Button variant='danger' onClick={onConfirm} disabled={loading}>
                    {loading ? 'Memproses...' : confirmText}
                </Button>
            </div>
        </Modal>
    );
}
