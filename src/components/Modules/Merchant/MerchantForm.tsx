import React from 'react';
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
    const {
        register,
        formState: { errors },
    } = form;

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
                            min: { value: -90, message: 'Latitude minimal -90' },
                            max: { value: 90, message: 'Latitude maksimal 90' },
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
                            min: { value: -180, message: 'Longitude minimal -180' },
                            max: { value: 180, message: 'Longitude maksimal 180' },
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

                <InputPassword
                    label='Password'
                    name='password'
                    register={register}
                    placeholder='Masukkan password'
                    error={errors.password?.message}
                    rules={{ required: isEdit ? false : 'Password wajib diisi' }}
                />

                <Checkbox label='Aktif' name='status' register={register} />

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
