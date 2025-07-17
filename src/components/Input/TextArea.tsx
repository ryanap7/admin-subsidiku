import { TextAreaProps } from '../../types/ComponentModels';

export default function TextArea({ label, name, register, error, description, rules, ...rest }: TextAreaProps) {
    return (
        <div>
            <label className='block text-sm font-medium text-gray-700 mb-1'>{label}</label>
            <textarea
                 {...(register && register(name, rules))}
                {...rest}
                className={`
          w-full px-3 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent
          ${error ? 'border-red-300 focus:ring-red-500' : 'border-gray-300 focus:ring-green-500'}
        `}
            />
            {error ? (
                <p className='text-sm text-red-600 mt-1'>{error}</p>
            ) : description ? (
                <small className='text-gray-500 text-xs mt-1'>{description}</small>
            ) : null}
        </div>
    );
}
