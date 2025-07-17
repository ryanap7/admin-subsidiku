import { SelectBoxProps } from '../../types/ComponentModels';

export default function SelectBox({ label, name, options, register, description, rules, error, ...rest }: SelectBoxProps) {
    return (
        <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>{label}</label>
            <div className='relative'>
                <select
                    {...(register && register(name, rules))}
                    {...rest}
                    className={`
                        appearance-none w-full pl-3 pr-10 py-2 border rounded-xl bg-white
                        focus:outline-none focus:ring-2 focus:border-transparent
                        ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}
                    `}
                >
                    {!rest.multiple && <option value=''>Pilih...</option>}
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>
            {error ? (
                <p className='text-sm text-red-600 mt-1'>{error}</p>
            ) : description ? (
                <small className='text-gray-500 text-xs mt-1'>{description}</small>
            ) : null}
        </div>
    );
}
