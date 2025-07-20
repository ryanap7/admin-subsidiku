import { ChangeEvent } from 'react';
import { InputNumberProps } from '../../types/ComponentModels';

export default function InputNumber({
  label,
  name,
  register, 
  prefix,
  suffix,
  placeholder,
  disabled = false,
  error,
  rules,
  helperText,
  ...rest
}: InputNumberProps) {
  // Format visual: 1.234,56 (Indonesia)
  const formatDisplay = (val: string) => {
    if (!val) return '';
    const [intPart, decimalPart] = val.replace(/\./g, '').split(',');
    const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return decimalPart !== undefined ? `${formattedInt},${decimalPart}` : formattedInt;
  };

  // Convert ke number: '1.234,56' => 1234.56
  const parseNumber = (val: string): number | null => {
    if (!val) return null;
    const cleaned = String(val).replace(/\./g, '').replace(',', '.');
    const parsed = parseFloat(cleaned);
    return isNaN(parsed) ? null : parsed;
  };

  const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const allowed = raw.replace(/[^0-9,]/g, ''); // hanya angka dan koma desimal
    const formatted = formatDisplay(allowed);
    e.target.value = formatted;
  };

  return (
    <div>
      {label && (
        <label htmlFor={name} className='block text-sm font-medium text-gray-700 mb-1'>
          {label}
        </label>
      )}

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
          disabled={disabled}
          onInput={handleInput}
          className={`
            w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent
            ${prefix ? 'pl-8' : ''}
            ${suffix ? 'pr-8' : ''}
            ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
          `}
          {...rest}
          {...register(name, {
            ...rules,
            setValueAs: (val: string) => parseNumber(val),
          })}
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
