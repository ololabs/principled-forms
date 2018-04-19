import { Maybe } from 'true-myth';

import Field, { FieldConstructors, Type } from '.';
import Validity, { Validator } from '../validity';

type RequiredNumberConfig = Partial<{
  value: number;
  validators: Array<Validator<number>>;
  validity: Validity;
  eager: boolean;
}>;

type OptionalNumberConfig = Partial<{
  value: number | Maybe<number>;
  validators: Array<Validator<number>>;
  validity: Validity;
  eager: boolean;
}>;

export const Number: FieldConstructors<number> = {
  required({
    validators = [],
    value = undefined,
    validity = Validity.unvalidated(),
    eager = false,
  }: RequiredNumberConfig) {
    return Field.required({ type: Type.number, validators, value, validity, eager });
  },

  optional({
    validators = [],
    value = undefined,
    validity = Validity.unvalidated(),
    eager = false,
  }: OptionalNumberConfig) {
    return Field.optional({ type: Type.number, validators, value, validity, eager });
  },
};

export default Number;
