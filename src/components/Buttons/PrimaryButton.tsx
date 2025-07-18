import { ButtonProps } from '../../types/ComponentModels';
import Button from '../UI/Button';

export default function PrimaryButton({ ...props }: ButtonProps) {
    return (
        <Button variant='primary' {...props}>
            {props.children}
        </Button>
    );
}
