import { motion } from 'framer-motion';
import { PageHeaderProps } from '../../types/ComponentModels';

export default function PageHeader({ title, description, children }: PageHeaderProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'
        >
            <div>
                <h1 className='text-3xl font-bold text-gray-800'>{title}</h1>
                <p className='text-gray-600 mt-1'>{description}</p>
            </div>
            <div className='flex gap-3'>{children}</div>
        </motion.div>
    );
}
