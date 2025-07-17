import _ from 'lodash';
import { useEffect, useState } from 'react';
import { SuspendModalProps } from '../../../types/ComponentModels';
import TextArea from '../../Input/TextArea';
import Button from '../../UI/Button';
import Modal from '../../UI/Modal';

export default function SuspendModal({ isOpen, onClose, onSuspend, selectedRecipient }: SuspendModalProps) {
    const [suspensionNotes, setSuspensionNotes] = useState('');

    useEffect(() => {
        setSuspensionNotes('');
    }, [isOpen]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title='Tangguhkan Penerima' size='md'>
            <div className='space-y-4'>
                <div className='p-4 bg-red-50 border border-red-200 rounded-xl'>
                    <p className='text-sm text-red-800'>
                        Tindakan ini akan menangguhkan akses subsidi untuk <strong>{selectedRecipient?.name}</strong>. Apakah Anda yakin?
                    </p>
                </div>
                <TextArea
                    label='Alasan Penangguhan'
                    placeholder='Masukkan alasan penangguhan...'
                    name='suspensionNotes'
                    onChange={(e) => setSuspensionNotes(e.target.value)}
                />

                <div className='flex justify-end space-x-3 pt-4'>
                    <Button variant='secondary' onClick={onClose}>
                        Batal
                    </Button>
                    <Button disabled={_.isEmpty(suspensionNotes)} variant='danger' onClick={() => onSuspend(suspensionNotes)}>
                        Tangguhkan
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
