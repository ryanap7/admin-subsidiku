import { ChangeEvent, KeyboardEvent, useState } from 'react';
import { InputNumberProps } from '../../types/ComponentModels';

export default function InputNumber({
    label,
    name,
    register,
    min,
    max,
    prefix,
    suffix,
    placeholder,
    disabled = false,
    error,
    rules,
    helperText,
    onChange,
    ...rest
}: InputNumberProps) {
    const [displayValue, setDisplayValue] = useState<string>('');

    const formatWithThousandSeparator = (value: string) => {
        if (!value) return '';
        const [integer, decimal] = value.split('.');
        const formatted = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return decimal !== undefined ? `${formatted}.${decimal}` : formatted;
    };

    const parseToNumber = (val: string): number | null => {
        if (!val || val === '') return null;
        const normalized = String(val)?.replace(/,/g, '');
        const num = parseFloat(normalized);
        return isNaN(num) ? null : num;
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;

        const cleaned = raw
            .replace(/[^0-9.,]/g, '')         // hanya angka, titik, koma
            .replace(/,/g, '')                // hapus koma (ribuan)
            .replace(/^0+(?=\d)/, '')         // hapus 0 diawal
            .replace(/(\..*)\./g, '$1');      // hanya 1 titik

        const numericValue = parseToNumber(cleaned);
        const formattedDisplay = formatWithThousandSeparator(cleaned);

        setDisplayValue(formattedDisplay);

        if (numericValue !== null) {
            if (min !== undefined && numericValue < min) return;
            if (max !== undefined && numericValue > max) return;
        }

        if (onChange) onChange(numericValue);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        const allowed = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'];
        const isControl = allowed.includes(e.key);
        const isDigit = /^[0-9]$/.test(e.key);
        const isDot = e.key === '.';

        if (!isDigit && !isControl && !isDot) {
            e.preventDefault();
        }
    };

    return (
        <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>{label}</label>

            <div className='relative'>
                {prefix && (
                    <span className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm'>
                        {prefix}
                    </span>
                )}

                <input
                    type='text'
                    inputMode='decimal'
                    pattern='[0-9.,]*'
                    placeholder={placeholder}
                    value={displayValue}
                    onKeyDown={handleKeyDown}
                    className={`
                        w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent
                        ${prefix ? 'pl-8' : ''}
                        ${suffix ? 'pr-8' : ''}
                        ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}
                        ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
                    `}
                    disabled={disabled}
                    {...rest}
                    {...(register &&
                        register(name, {
                            ...rules,
                            setValueAs: (val) => parseToNumber(val),
                        }))}
                    onChange={handleChange}
                />

                {suffix && (
                    <span className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm'>
                        {suffix}
                    </span>
                )}
            </div>

            {error && <p className='mt-1 text-sm text-red-600'>{error}</p>}
            {!error && helperText && <p className='mt-1 text-sm text-gray-500'>{helperText}</p>}
        </div>
    );
}
