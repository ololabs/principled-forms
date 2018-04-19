import { Maybe } from 'true-myth';

import Field, { FieldConstructors, Type } from '.';
import { Validator, Validity } from '../validity';
import { regex } from '../validators';

const EMAIL_RE = /.+@.+\..+/;
const emailValidator = regex(EMAIL_RE, (val: string) => `${val} is not a valid email address`);

type RequiredEmailConfig = {
  value: string;
  validators: Array<Validator<string>>;
  validity: Validity;
};

type OptionalEmailConfig = {
  value: string | Maybe<string>;
  validators: Array<Validator<string>>;
  validity: Validity;
};

export const Email: FieldConstructors<string> = {
  required({
    value = undefined,
    validators = [],
    validity = Validity.unvalidated(),
  }: Partial<RequiredEmailConfig>) {
    return Field.required({
      type: Type.email,
      value,
      validators: [emailValidator].concat(validators),
      validity,
      eager: false,
    });
  },

  optional({
    value = undefined,
    validators = [],
    validity = Validity.unvalidated(),
  }: Partial<OptionalEmailConfig>) {
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
