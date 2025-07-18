import Button from './Button';
import Modal from './Modal';

interface ConfirmModalProps {
    isOpen: boolean;
    title?: string;
    message: string | React.ReactNode;
    confirmText?: string;
    cancelText?: string;
    onClose: () => void;
    onConfirm: () => void;
    loading?: boolean;
    variant?: 'primary' | 'danger';
    children?: React.ReactNode;
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
    variant = 'danger',
    children
}: ConfirmModalProps) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <p className='text-sm text-gray-700'>{message}</p>
            {children}
            <div className='flex justify-end space-x-3 pt-6'>
                <Button variant='secondary' onClick={onClose} disabled={loading}>
                    {cancelText}
                </Button>
                <Button variant={variant} onClick={onConfirm} disabled={loading}>
                    {loading ? 'Memproses...' : confirmText}
                </Button>
            </div>
        </Modal>
    );
}
