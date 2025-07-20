import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, size = 'md' }) => {
    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className='fixed inset-0 z-50 flex items-center -top-6 max-h-screen justify-center'>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className='fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm'
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        className={`relative h-max max-h-[96vh] overflow-y-scroll w-full ${sizeClasses[size]} mx-4 bg-white rounded-2xl shadow-xl overflow-hidden`}
                    >
                        <div className='flex items-center justify-between p-6 border-b border-gray-200'>
                            <h2 className='text-xl font-semibold text-gray-800'>{title}</h2>
                            <button type='button' onClick={onClose} className='p-2 rounded-lg hover:bg-gray-100 transition-colors'>
                                <X className='w-5 h-5 text-gray-600' />
                            </button>
                        </div>
                        <div className='p-6'>{children}</div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
