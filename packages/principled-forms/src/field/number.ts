import { Maybe } from 'true-myth';

import Field, { FieldConstructors, Type, OptionalField, RequiredField } from '.';
import { Validator } from '../validity';

type RequiredNumberConfig = Partial<{
  value: number;
  validators: Array<Validator<number>>;
}>;

type OptionalNumberConfig = Partial<{
  value: number | Maybe<number>;
  validators: Array<Validator<number>>;
}>;

export const Number: FieldConstructors<number> = {
  required({
    validators = [],
    value = undefined,
  }: RequiredNumberConfig = {}): RequiredField<number> {
    return Field.required({ type: Type.number, validators, value });
  },

  optional({
    validators = [],
    value = undefined,
  }: OptionalNumberConfig = {}): OptionalField<number> {
    return Field.optional({ type: Type.number, validators, value });
  },
};

export type NumberField = Field<number>;

export default Number;
