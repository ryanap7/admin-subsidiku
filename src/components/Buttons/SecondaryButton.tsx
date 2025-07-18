import { ButtonProps } from '../../types/ComponentModels';
import Button from '../UI/Button';

export default function SecondaryButton({ ...props }: ButtonProps) {
    return (
        <Button variant='secondary' {...props}>
            {props.children}
        </Button>
    );
}
