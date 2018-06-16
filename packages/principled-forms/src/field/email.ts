import { Maybe } from 'true-myth';

import Field, { FieldConstructors, Type, RequiredField, OptionalField } from '../field';
import { Validator, Validity } from '../validity';
import { regex, ErrMessage } from '../validators';

export const EMAIL_RE = /.+@.+\..+/;
const validator = (messageBuilder: ErrMessage<string>) => regex(EMAIL_RE, messageBuilder);

export type RequiredEmailConfig = Partial<{
  value: string;
  validators: Array<Validator<string>>;
  validity: Validity;
  emailMessage: (suppliedValue: string) => string;
}>;

export const required = ({
  value = undefined,
  validators = [],
  emailMessage = (suppliedValue: string) => `${suppliedValue} is not a valid email address`
}: RequiredEmailConfig = {}): RequiredField<string> =>
  Field.required({
    type: Type.email,
    value,
    validators: [validator(emailMessage)].concat(validators)
  });

export type OptionalEmailConfig = Partial<{
  value: string | Maybe<string>;
  validators: Array<Validator<string>>;
  validity: Validity;
  emailMessage: (suppliedValue: string) => string;
}>;

export const optional = ({
  value = undefined,
  validators = [],
  emailMessage = (suppliedValue: string) => `${suppliedValue} is not a valid email address`
}: OptionalEmailConfig = {}): OptionalField<string> =>
  Field.optional({
    type: Type.email,
    value,
    validators: [validator(emailMessage)].concat(validators)
  });

interface EmailFieldConstructors extends FieldConstructors<string> {
  optional: typeof optional;
  required: typeof required;
  EMAIL_RE: RegExp;
}

export type Email = Field<string>;
export const Email: EmailFieldConstructors = {
  required,
  optional,
  EMAIL_RE
};

export default Email;
