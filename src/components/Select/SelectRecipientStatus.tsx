import { ChevronDown } from 'lucide-react';
import { recipientStatus } from '../../utils/options';

export default function SelectRecipientStatus({ value, onChange }: { value: string; onChange: (value: string) => void }) {
    return (
        <div className='relative'>
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className='appearance-none pl-4 pr-12 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white'
            >
                <option value='all'>Semua Status</option>
                {recipientStatus.map((status) => (
                    <option key={status.value} value={status.value}>
                        {status.label}
                    </option>
                ))}
            </select>
            <ChevronDown className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none' />
        </div>
    );
}
