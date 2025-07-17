import { InputHTMLAttributes, ReactNode } from 'react';
import { InputTextProps } from '../../types/ComponentModels';

export default function Checkbox({
    label,
    name,
    register,
    children,
    rules,
    error,
    description,
    ...rest
}: InputTextProps & InputHTMLAttributes<HTMLInputElement> & { children?: ReactNode }) {
    return (
        <div className='flex items-center'>
            <input
                type='checkbox'
               {...(register && register(name, rules))}
                {...rest} 
                id={name}
                className='size-4 rounded border-gray-300 text-green-600 shadow-sm focus:border-green-300 focus:ring focus:ring-green-200 focus:ring-opacity-50'
            />
            <label className='ml-2 text-sm font-medium text-gray-700' htmlFor={name}>
                {label}
                {children}
            </label>
             {error ? (
                <p className='text-sm text-red-600 mt-1'>{error}</p>
            ) : description ? (
                <small className='text-gray-500 text-xs mt-1'>{description}</small>
            ) : null}
        </div>
    );
}
