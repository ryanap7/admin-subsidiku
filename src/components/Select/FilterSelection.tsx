import { ChevronDown } from 'lucide-react';

export default function FilterSelection({
    options,
    ...props
}: { options: { value: string; label: string }[] } & React.SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <div className='relative'>
            <select
                {...props}
                className={[
                    'appearance-none pl-4 pr-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white',
                    props.className,
                ].join(' ')}
            >
                {options.map((status) => (
                    <option key={status.value} value={status.value}>
                        {status.label}
                    </option>
                ))}
            </select>
            <ChevronDown className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none' />
        </div>
    );
}
