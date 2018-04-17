import { FieldConstructor, RequiredField, OptionalField, InputField, Type } from '.';
import { Validator } from '../validity';

export const Number: FieldConstructor<number> = {
  required(validators: Array<Validator<number>>, value?: number): RequiredField<number> {
    return InputField.required(Type.number, validators, value);
  },

  optional(validators: Array<Validator<number>>, value?: number): OptionalField<number> {
    return InputField.optional(Type.number, validators, value);
  },
};

export default Number;
