import { Plus, Trash2 } from 'lucide-react';
import React, { useEffect } from 'react';
import { useFieldArray, useWatch } from 'react-hook-form';
import { useProductStore } from '../../../store/useProductStore';
import { generateOptions } from '../../../utils';
import { districtOptions } from '../../../utils/options';
import PrimaryButton from '../../Buttons/PrimaryButton';
import SecondaryButton from '../../Buttons/SecondaryButton';
import Checkbox from '../../Input/Checkbox';
import InputNumber from '../../Input/InputNumber';
import InputPassword from '../../Input/InputPassword';
import InputText from '../../Input/InputText';
import TextArea from '../../Input/TextArea';
import SelectBox from '../../Select/SelectBox';
import Modal from '../../UI/Modal';

 const StockItem = ({ index, register, errors, products, control, onRemove }) => {
        const selectedProductId = useWatch({
            control,
            name: `products.${index}.productId`,
        });

        const unit = products.find((p) => p.id === selectedProductId)?.unit;

        return (
            <div className='grid grid-cols-2 items-start gap-2'>
                <SelectBox
                    rules={{ required: 'Jenis produk harus dipilih' }}
                    label='Jenis Produk'
                    name={`products.${index}.productId`}
                    register={register}
                    options={generateOptions(products, 'name', 'id')}
                    error={errors?.[`products.${index}.productId`]?.message}
                />
                <div className='flex gap-2 items-center w-full'>
                    <div className='w-full'>
                        <InputNumber
                            label={`Jumlah produk ${unit ? `(${unit})` : ''}`}
                            name={`products.${index}.quantity`}
                            register={register}
                            placeholder='Masukkan jumlah produk'
                            error={errors?.[`products.${index}.quantity`]?.message}
                            rules={{ required: 'Kapasitas wajib diisi' }}
                        />
                    </div>
                    <Trash2 className='cursor-pointer text-red-500 size-6 mt-5' onClick={() => onRemove(index)} />
                </div>
            </div>
        );
    };
    
export default function MerchantForm({
    isOpen,
    onClose,
    onSubmit,
    onCancel,
    isEdit,
    form,
}: {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
    onCancel: () => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    form: any;
    isEdit?: boolean;
}) {
    const { fetchProducts, products } = useProductStore();

    const {
        register,
        getValues,
        control,
        formState: { errors },
    } = form;

    const { fields, remove, append } = useFieldArray({
        control,
        name: 'products',
    });

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

   

    const renderStockForm = () => {
        return (
            <>
                <p className='pt-6 font-semibold'>Stok</p>
                <div className='flex flex-col gap-4'>
                    {fields.map((field, index) => (
                        <StockItem
                            key={field.id}
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            field={field}
                            index={index}
                            register={register}
                            errors={errors}
                            products={products}
                            control={control}
                            onRemove={remove}
                        />
                    ))}
                    <SecondaryButton Icon={Plus} className='w-max mx-auto mt-4' type='button' onClick={() => append({ productId: '', quantity: 0 })}>
                        Tambah Stok
                    </SecondaryButton>
                </div>
            </>
        );
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Agen' : 'Tambah Agen Baru'} size='lg'>
            <form className='space-y-4' onSubmit={onSubmit}>
                <InputText
                    label='Nama Agen'
                    name='name'
                    register={register}
                    placeholder='Masukkan nama agen'
                    rules={{ required: 'Nama agen wajib diisi' }}
                    error={errors.name?.message}
                />

                <InputText
                    label='Nama Pemilik'
                    name='ownerName'
                    register={register}
                    placeholder='Masukkan nama pemilik'
                    rules={{ required: 'Nama pemilik wajib diisi' }}
                    error={errors.ownerName?.message}
                />

                <InputText
                    label='NIK'
                    name='nik'
                    description='NIK harus terdiri dari 16 digit'
                    register={register}
                    placeholder='Masukkan NIK'
                    rules={{
                        required: 'NIK wajib diisi',
                        minLength: {
                            value: 16,
                            message: 'NIK harus terdiri dari 16 digit',
                        },
                        maxLength: {
                            value: 16,
                            message: 'NIK harus terdiri dari 16 digit',
                        },
                    }}
                    error={errors.nik?.message}
                />

                <InputText
                    label='Nomor Handphone'
                    name='phone'
                    register={register}
                    placeholder='Masukkan nomor handphone'
                    rules={{ required: 'Nomor handphone wajib diisi' }}
                    error={errors.phone?.message}
                />

                <SelectBox
                    label='Kecamatan'
                    name='district'
                    register={register}
                    options={districtOptions}
                    rules={{ required: 'Kecamatan harus dipilih' }}
                    error={errors.district?.message}
                />

                <TextArea
                    label='Alamat Lengkap'
                    name='address'
                    register={register}
                    placeholder='Masukkan alamat lengkap'
                    rules={{ required: 'Alamat wajib diisi' }}
                    error={errors.address?.message}
                />

                <div className='grid grid-cols-2 gap-4'>
                    <InputText
                        label='Latitude'
                        name='lat'
                        type='number'
                        register={register}
                        rules={{
                            required: 'Latitude wajib diisi',
                            valueAsNumber: true,
                            // min: { value: -90, message: 'Latitude minimal -90' },
                            // max: { value: 90, message: 'Latitude maksimal 90' },
                        }}
                        placeholder='Contoh: -6.21462'
                        error={errors.lat?.message}
                    />

                    <InputText
                        type='number'
                        label='Longitude'
                        name='lng'
                        step='any'
                        register={register}
                        placeholder='Contoh: 110.3261904'
                        onWheel={(e) => e.currentTarget.blur()}
                        rules={{
                            required: 'Longitude wajib diisi',
                            valueAsNumber: true,
                            // min: { value: -180, message: 'Longitude minimal -180' },
                            // max: { value: 180, message: 'Longitude maksimal 180' },
                        }}
                        error={errors.lng?.message}
                    />
                </div>

                <InputNumber
                    label='Kapasitas Maksimum'
                    name='maxCapacity'
                    register={register}
                    placeholder='Masukkan kapasitas maksimum'
                    error={errors.maxCapacity?.message}
                    rules={{ required: 'Kapasitas wajib diisi' }}
                />

                {getValues('id') && (
                    <InputNumber
                        label='Saldo (Rp)'
                        name='balance'
                        register={register}
                        placeholder='Masukkan saldo'
                        error={errors.balance?.message}
                        rules={{ required: 'Saldo wajib diisi' }}
                    />
                )}

                <InputPassword
                    key={'password'}
                    label='Password'
                    name='password'
                    register={register}
                    placeholder='Masukkan password'
                    error={errors.password?.message}
                    rules={{ required: isEdit ? false : 'Password wajib diisi' }}
                />

                <Checkbox label='Aktif' name='status' register={register} />

                {isEdit && renderStockForm()}

                <div className='flex justify-end space-x-3 pt-4'>
                    <SecondaryButton type='button' onClick={onCancel}>
                        Batal
                    </SecondaryButton>
                    <PrimaryButton type='submit'>{isEdit ? 'Simpan Perubahan' : 'Simpan'}</PrimaryButton>
                </div>
            </form>
        </Modal>
    );
}
