import { FieldConstructor, RequiredField, OptionalField, Type } from '.';
import { Validator } from '../validity';

export const Number: FieldConstructor<number> = {
  required(validators: Array<Validator<number>>, value?: number): RequiredField<number> {
    return new RequiredField(Type.number, validators, value);
  },

  optional(validators: Array<Validator<number>>, value?: number): OptionalField<number> {
    return new OptionalField(Type.number, validators, value);
  },
};

export default Number;
