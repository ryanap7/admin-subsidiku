import { InputTextProps } from '../../types/ComponentModels';

export default function RadioGroup({
    label,
    name,
    register,
    options,
    rules,
    error,
    description,
}: InputTextProps & { options: { label: string; value: string }[] }) {
    return (
        <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>{label}</label>
            <div className='flex items-center text-sm space-x-4 mt-2'>
                {options.map((opt) => (
                    <label key={opt.value} className='flex items-center'>
                        <input type='radio' value={opt.value} {...(register && register(name, rules))} className='mr-2' />
                        {opt.label}
                    </label>
                ))}
                {error ? (
                    <p className='text-sm text-red-600 mt-1'>{error}</p>
                ) : description ? (
                    <small className='text-gray-500 text-xs mt-1'>{description}</small>
                ) : null}
            </div>
        </div>
    );
}
