import { UseFormRegister, UseFormSetValue, UseFormWatch } from 'react-hook-form';
import { Merchant, Product, Recipient } from '../../../types';
import { generateOptions } from '../../../utils';
import { booleanOptions, classificationOptions, districtOptions, homeOwnershipOptions, recipientStatus } from '../../../utils/options';
import DropdownMultipleSelect from '../../Select/DropdownMultipleSelect';
import InputNumber from '../../Input/InputNumber';
import InputPassword from '../../Input/InputPassword';
import InputText from '../../Input/InputText';
import RadioGroup from '../../Input/RadioGroup';
import SelectBox from '../../Select/SelectBox';
import TextArea from '../../Input/TextArea';
import FormButtons from '../../UI/FormButtons';
import Modal from '../../UI/Modal';

interface RecipientFormProps extends Recipient {
    subsidies: string[];
}

export default function RecipientForm({
    register,
    watch,
    isOpen,
    onClose,
    isEdit,
    products,
    merchants,
    setValue,
    onSubmit,
}: {
    register: UseFormRegister<RecipientFormProps>;
    watch: UseFormWatch<RecipientFormProps>;
    setValue: UseFormSetValue<RecipientFormProps>;
    isOpen: boolean;
    onClose: () => void;
    isEdit: boolean;
    products: Product[];
    merchants: Merchant[];
    onSubmit: (data) => void;
}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={isEdit ? 'Edit Penerima Subsidi' : 'Tambah Penerima Subsidi'} size='xl'>
            <form onSubmit={onSubmit}>
                <div className='space-y-4'>
                    <h3 className='text-lg font-semibold text-gray-800'>Informasi Pribadi</h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <InputText label='NIK' name='nik' register={register} placeholder='Masukkan NIK' />
                        <InputText label='Nama Lengkap' name='name' register={register} placeholder='Masukkan nama lengkap' />
                    </div>

                    <InputText label='Nomor Handphone' name='phone' register={register} placeholder='Masukkan nomor handphone' />
                    <TextArea label='Alamat' name='address' register={register} placeholder='Masukkan alamat lengkap' />
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <SelectBox label='Kecamatan' name='district' register={register} options={districtOptions} />

                       {!isEdit && <DropdownMultipleSelect
                            label='Jenis Subsidi'
                            name='subsidies'
                            register={register}
                            options={generateOptions(products, 'name', 'id')}
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-ignore
                            setValue={setValue}
                            watch={watch}
                            maxHeight='250px'
                        />}
                    </div>
                    <SelectBox label='Agen' name='merchantId' register={register} options={generateOptions(merchants, 'name', 'id')} />
                    <InputPassword label='Password' name='password' register={register} placeholder='Masukkan password' />
                    <RadioGroup label='Status' name='status' register={register} options={recipientStatus} />
                </div>

                <div className='space-y-4 mt-4'>
                    <h3 className='text-lg font-semibold text-gray-800'>Informasi Ekonomi</h3>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <SelectBox label='Klasifikasi' name='classification' register={register} options={classificationOptions} />
                        <InputNumber label='Pendapatan Bulanan' name='income' register={register} placeholder='Masukkan pendapatan bulanan' />
                        <InputNumber
                            label='Jumlah Anggota Keluarga'
                            name='familiyMembers'
                            register={register}
                            placeholder='Masukkan jumlah anggota keluarga'
                        />
                        <InputNumber label='Luas Lahan (Ha)' name='landArea' step={0.1} register={register} placeholder='Masukkan luas lahan' />
                        <SelectBox label='Status Kepemilikan Rumah' name='homeOwnership' register={register} options={homeOwnershipOptions} />
                        <InputText label='Nomor Kartu Jaminan Sosial' name='kjsNumber' register={register} placeholder='Masukkan nomor KIS/BPJS' />
                        <RadioGroup label='Memiliki Rekening Bank' name='haveBankAccount' register={register} options={booleanOptions} />
                    </div>
                </div>

                <FormButtons okText={isEdit ? 'Simpan Perubahan' : 'Simpan'} onCancel={onClose} />
            </form>
        </Modal>
    );
}
