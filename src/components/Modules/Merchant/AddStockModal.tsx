import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useProductStore } from '../../../store/useProductStore';
import { MerchantProduct } from '../../../types';
import { generateOptions } from '../../../utils';
import InputNumber from '../../Input/InputNumber';
import SelectBox from '../../Select/SelectBox';
import Button from '../../UI/Button';
import Modal from '../../UI/Modal';

const AddStockModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (data: MerchantProduct) => void }> = ({
    isOpen,
    onClose,
    onSubmit,
}) => {
    const { products, fetchProducts } = useProductStore();

    const {
        register,
        handleSubmit, 
        formState: { errors },
    } = useForm<MerchantProduct>({
        defaultValues: {
            productId: '',
            quantity: 0, 
        },
    });

    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []); 

    return (
        <Modal isOpen={isOpen} onClose={onClose} title='Tambah Stok' size='md'>
            <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
                <SelectBox
                    label='Jenis Produk'
                    name='productId'
                    register={register}
                    options={generateOptions(products, 'name', 'id')}
                    rules={{ required: 'Produk harus dipilih' }}
                    error={errors.productId?.message}
                />
                <InputNumber
                    label='Jumlah Stok'
                    placeholder='Masukkan jumlah stok'
                    register={register}
                    name='quantity'
                    rules={{ required: 'Jumlah stok harus diisi' }}
                    error={errors.quantity?.message}
                />
                {/* <TextArea label='Catatan' placeholder='Catatan tambahan (opsional)' register={register} name='note' /> */}
                <div className='flex justify-end space-x-3 pt-4'>
                    <Button variant='secondary' onClick={onClose}>
                        Batal
                    </Button>
                    <Button type='submit' variant='primary'>
                        Tambah Stok
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default AddStockModal;
