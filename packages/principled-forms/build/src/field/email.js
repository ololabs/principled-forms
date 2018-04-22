import Field, { Type } from '.';
import { Validity } from '../validity';
import { regex } from '../validators';
const EMAIL_RE = /.+@.+\..+/;
const emailValidator = regex(EMAIL_RE, (val) => `${val} is not a valid email address`);
export const Email = {
    required({ value = undefined, validators = [], validity = Validity.unvalidated(), }) {
        return Field.required({
            type: Type.email,
            value,
            validators: [emailValidator].concat(validators),
            validity,
            eager: false,
        });
    },
    optional({ value = undefined, validators = [], validity = Validity.unvalidated(), }) {
        return Field.optional({
            type: Type.email,
            value,
            validators: [emailValidator].concat(validators),
            validity,
            eager: false,
        });
    },
};
export default Email;
