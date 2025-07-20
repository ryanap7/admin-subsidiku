import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { PageHeaderProps } from '../../types/ComponentModels';
import SecondaryButton from '../Buttons/SecondaryButton';

export default function PageHeader({ title, description, children, path }: PageHeaderProps) {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'
        >
            <div className='flex items-center gap-x-4'>
                {path && (
                    <SecondaryButton Icon={ArrowLeft} onClick={() => navigate(path)}>
                        Kembali
                    </SecondaryButton>
                )}

                <div>
                    <h1 className='text-3xl font-bold text-gray-800'>{title}</h1>
                    <p className='text-gray-600 mt-1'>{description}</p>
                </div>
            </div>
            <div className='flex gap-3'>{children}</div>
        </motion.div>
    );
}
