import React from 'react';
import { useForm } from 'react-hook-form';
import { Merchant } from '../../../types';
import InputText from '../../Input/InputText';
import TextArea from '../../Input/TextArea';
import Button from '../../UI/Button';
import Modal from '../../UI/Modal';

const UpdateLocationModal: React.FC<{
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: Merchant) => void;
    initialData: { lat: number; lng: number; address: string };
}> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<Merchant>({
        defaultValues: initialData,
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose} title='Tambah Stok' size='md'>
            <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
                <div className='grid grid-cols-2 gap-4'>
                    <InputText
                        label='Latitude'
                        name='lat'
                        type='number'
                        register={register}
                        rules={{
                            required: 'Latitude wajib diisi',
                            valueAsNumber: true,
                            min: { value: -90, message: 'Latitude minimal -90' },
                            max: { value: 90, message: 'Latitude maksimal 90' },
                        }}
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
                            min: { value: -180, message: 'Longitude minimal -180' },
                            max: { value: 180, message: 'Longitude maksimal 180' },
                        }}
                        error={errors.lng?.message}
                    />
                </div>

                <TextArea
                    label='Alamat Baru'
                    name='address'
                    register={register}
                    placeholder='Masukkan alamat baru'
                    rules={{ required: 'Alamat wajib diisi' }}
                    error={errors.address?.message}
                />

                <div className='p-3 bg-yellow-50 border border-yellow-200 rounded-xl'>
                    <p className='text-sm text-yellow-800'>
                        <strong>Catatan:</strong> Perubahan lokasi akan mempengaruhi perhitungan jarak dan rute pengiriman.
                    </p>
                </div>
                <div className='flex justify-end space-x-3 pt-4'>
                    <Button variant='secondary' onClick={onClose}>
                        Batal
                    </Button>
                    <Button type='submit' variant='primary'>
                        Update Lokasi
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default UpdateLocationModal;
