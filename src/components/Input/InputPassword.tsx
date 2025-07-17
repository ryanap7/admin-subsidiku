import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { InputTextProps } from '../../types/ComponentModels';

export default function InputPassword({ label, name, register, error, description, rules, ...rest }: InputTextProps) {
    const [showPassword, setShowPassword] = useState(false);

    const handleClick = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>{label}</label>
            <div className='relative'>
                <input
                    {...(register && register(name, rules))}
                    autoComplete='new-password'
                    type={showPassword ? 'text' : 'password'}
                    className={`
                        w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent
                        ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}
                    `}
                    {...rest}
                />
                <button type='button' onClick={handleClick} className='absolute inset-y-0 right-0 pr-3 flex items-center'>
                    {showPassword ? <EyeOff className='w-5 h-5' /> : <Eye className='w-5 h-5' />}
                </button>
            </div>
            {error ? (
                <p className='text-sm text-red-600 mt-1'>{error}</p>
            ) : description ? (
                <small className='text-gray-500 text-xs mt-1'>{description}</small>
            ) : null}
        </div>
    );
}
