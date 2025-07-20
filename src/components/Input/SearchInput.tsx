import { Search } from 'lucide-react';
import React from 'react';

export default function SearchInput({ ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <div className='flex-1 relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5' />
            <input
                {...props}
                type='text'
                className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent ${props.className}`}
            />
        </div>
    );
}
