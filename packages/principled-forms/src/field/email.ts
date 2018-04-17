import { regex } from '../validators';
import { FieldConstructor, Type, RequiredField, OptionalField } from '.';
import { Validator } from '../validity';

const EMAIL_RE = /.+@.+\..+/;
const emailValidator = regex(EMAIL_RE, (val: string) => `${val} is not a valid email address`);

export const Email: FieldConstructor<string> = {
  required(validators: Array<Validator<string>> = [], value?: string): RequiredField<string> {
    return new RequiredField(Type.email, [emailValidator].concat(validators), value);
  },

  optional(validators: Array<Validator<string>> = [], value?: string): OptionalField<string> {
    return new OptionalField(Type.email, [emailValidator].concat(validators), value);
  },
};

export default Email;
