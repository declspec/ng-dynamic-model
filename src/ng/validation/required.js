import { empty } from '../../util';

export function RequiredValidator(field, addError, args) {
    if (!empty(field.value()))
        return true;

    addError(args && args.message || `${field.label} is a required field`);
    return false;
}