import { useEffect, useRef, useState } from 'react';
import { DropdownMultipleSelectProps } from '../../types/ComponentModels';

export default function DropdownMultipleSelect({
    label,
    options,
    register,
    setValue,
    watch,
    name,
    placeholder = 'Pilih opsi...',
    searchable = true,
    maxHeight = '200px',
}: DropdownMultipleSelectProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Get watched values with proper fallback
    const watchedValues = watch ? watch(name) : [];
     
    // Use watchedValues directly, with fallback to empty array
    const selectedValues = Array.isArray(watchedValues) ? watchedValues : [];

    // Filter options based on search term
    const filteredOptions = options.filter((option) => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Toggle option selection
    const toggleOption = (value: string) => {
        if (!setValue) return;

        const currentValues = selectedValues || [];
        const newValues = currentValues.includes(value) 
            ? currentValues.filter((v: string) => v !== value) 
            : [...currentValues, value];

        setValue(name, newValues);
    };

    // Get selected labels for display
    const getSelectedLabels = () => {
        if (!selectedValues || selectedValues.length === 0) return placeholder;

        if (selectedValues.length === 1) {
            const option = options.find((opt) => opt.value === selectedValues[0]);
            return option ? option.label : '';
        }

        return `${selectedValues.length} item terpilih`;
    };

    // Remove selected item
    const removeItem = (value: string, event: React.MouseEvent) => {
        event.stopPropagation();
        if (setValue) {
            const newValues = selectedValues.filter((v: string) => v !== value);
            setValue(name, newValues);
        }
    };

    return (
        <div className='relative' ref={dropdownRef}>
            {/* Hidden input for form registration */}
            {register && (
                <input 
                    type='hidden' 
                    {...register(name)} 
                    value={JSON.stringify(selectedValues)} 
                />
            )}

            <label className='block text-sm font-medium text-gray-700 mb-1'>{label}</label>

            {/* Dropdown trigger */}
            <div
                onClick={() => setIsOpen(!isOpen)}
                className='relative w-full pl-3 pr-10 py-2 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white cursor-pointer flex items-center justify-between'
            >
                <span className={selectedValues?.length > 0 ? 'text-gray-900' : 'text-gray-500'}>
                    {getSelectedLabels()}
                </span>
                <svg
                    className={`absolute z-20 right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 transition-transform ${
                        isOpen ? 'rotate-180' : ''
                    }`}
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                >
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 9l-7 7-7-7' />
                </svg>
            </div>

            {/* Dropdown options */}
            {isOpen && (
                <div className='absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg'>
                    {/* Search input */}
                    {searchable && (
                        <div className='p-3 border-b border-gray-200'>
                            <input
                                type='text'
                                placeholder='Cari...'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className='w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500'
                                onClick={(e) => e.stopPropagation()}
                            />
                        </div>
                    )}

                    {/* Options list */}
                    <div className='max-h-[200px] overflow-y-auto' style={{ maxHeight }}>
                        {filteredOptions.length === 0 ? (
                            <div className='px-3 py-2 text-gray-500 text-center'>
                                {searchTerm ? 'Tidak ada hasil ditemukan' : 'Tidak ada opsi tersedia'}
                            </div>
                        ) : (
                            filteredOptions.map((option) => {
                                const isSelected = selectedValues?.includes(option.value);
                                return (
                                    <div
                                        key={option.value}
                                        onClick={() => toggleOption(option.value)}
                                        className={`px-3 py-2 cursor-pointer flex items-center hover:bg-gray-100 ${
                                            isSelected ? 'bg-green-50 text-green-700' : 'text-gray-900'
                                        }`}
                                    >
                                        <input
                                            type='checkbox'
                                            checked={isSelected}
                                            readOnly
                                            className='mr-3 text-green-600 rounded focus:ring-green-500'
                                        />
                                        <span className='flex-1'>{option.label}</span>
                                        {isSelected && (
                                            <svg className='w-4 h-4 text-green-600' fill='currentColor' viewBox='0 0 20 20'>
                                                <path
                                                    fillRule='evenodd'
                                                    d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                                                    clipRule='evenodd'
                                                />
                                            </svg>
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>

                    {/* Footer with selected count */}
                    {selectedValues && selectedValues.length > 0 && (
                        <div className='px-3 py-2 border-t border-gray-200 bg-gray-50 text-sm text-gray-600'>
                            {selectedValues.length} item terpilih
                        </div>
                    )}
                </div>
            )}

            {/* Selected items display */}
            {selectedValues && selectedValues.length > 0 && (
                <div className='flex flex-wrap gap-2 mt-2'>
                    {selectedValues.map((value: string) => {
                        const option = options.find((opt) => opt.value === value);
                        return option ? (
                            <span key={value} className='inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-800'>
                                {option.label}
                                <button type='button' onClick={(e) => removeItem(value, e)} className='ml-1 text-green-600 hover:text-green-800'>
                                    ×
                                </button>
                            </span>
                        ) : null;
                    })}
                </div>
            )}
        </div>
    );
}