import { Maybe } from 'true-myth';

import Field, { FieldConstructors, Type, OptionalField, RequiredField } from '../field';
import { Validator } from '../validity';

type RequiredNumberConfig = Partial<{
  value: number;
  validators: Array<Validator<number>>;
}>;

type OptionalNumberConfig = Partial<{
  value: number | Maybe<number>;
  validators: Array<Validator<number>>;
}>;

export const required = ({
  validators = [],
  value = undefined
}: RequiredNumberConfig = {}): RequiredField<number> =>
  Field.required({ type: Type.number, validators, value });

export const optional = ({
  validators = [],
  value = undefined
}: OptionalNumberConfig = {}): OptionalField<number> =>
  Field.optional({ type: Type.number, validators, value });

export const Number: FieldConstructors<number> = {
  required,
  optional
};

export type NumberField = Field<number>;

export default Number;
