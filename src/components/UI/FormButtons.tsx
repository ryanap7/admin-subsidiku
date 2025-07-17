import { FormButtonsProps } from '../../types/ComponentModels';
import Button from './Button';

export default function FormButtons({ okText, onCancel }: FormButtonsProps) {
    return (
        <div className='flex justify-end space-x-3 pt-4'>
            <Button variant='secondary' type='button' onClick={onCancel}>
                Batal
            </Button>
            <Button type='submit' variant='primary'>
                {okText}
            </Button>
        </div>
    );
}
