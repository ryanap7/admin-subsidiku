import { motion } from 'framer-motion';
import { SummaryCardProps } from '../../types/ComponentModels';
import Card from './Card';

const SummaryCard: React.FC<SummaryCardProps> = ({
    title,
    value,
    valueClassName = '',
    icon: Icon,
    iconBgClassName = '',
    iconClassName = '',
    subText,
    subTextClassName = '',
    delay = 0,
}) => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay }}>
        <Card className='p-6 min-h-full'>
            <div className='flex items-center justify-between gap-2'>
                <div className='flex flex-col justify-between'>
                    <p className='text-sm text-gray-600'>{title}</p>
                    <p className={`text-2xl font-bold ${valueClassName}`}>{value}</p>
                    {subText && <p className={`text-xs mt-1 ${subTextClassName}`}>{subText}</p>}
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBgClassName}`}>
                    <Icon className={`w-6 h-6 ${iconClassName}`} />
                </div>
            </div>
        </Card>
    </motion.div>
);

export default SummaryCard;
