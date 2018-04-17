import Validity, { Validator, Validated, required, optional } from '../validity';

export enum Type {
  email = 'email',
  text = 'text',
  number = 'number',
  color = 'color',
  date = 'date',
  password = 'password',
}

export const validate = <T>(field: Field<T>): Validated[] => {
  const rule = field.isRequired ? required : optional;
  return rule(...field.validators)(field.value);
};

// <Input type={{@model.type}} value={{@model.value}} />

export interface MinimalField<T> {
  value?: T;
  isRequired: boolean;
  readonly type: Type;
  readonly validators: Validator<T>[];
  readonly validities: Validity[];
}

export class RequiredField<T> implements MinimalField<T> {
  isRequired: true = true;

  get validities(): Validity[] {
    return validate(this as Field<T>);
  }

  constructor(readonly type: Type, readonly validators: Array<Validator<T>>, public value?: T) {}

  static create<T>(type: Type, validators: Array<Validator<T>>, value?: T) {
    return new RequiredField(type, validators, value);
  }
}

export class OptionalField<T> implements MinimalField<T> {
  isRequired: false = false;

  get validities(): Validity[] {
    return validate(this as Field<T>);
  }

  constructor(readonly type: Type, readonly validators: Array<Validator<T>>, public value?: T) {}

  static create<T>(type: Type, validators: Array<Validator<T>>, value?: T) {
    return new OptionalField(type, validators, value);
  }
}

export type Field<T> = RequiredField<T> | OptionalField<T>;

export interface FieldConstructor<T> {
  required(...args: any[]): RequiredField<T>;
  optional(...args: any[]): OptionalField<T>;
}

export const Field = {
  Required: RequiredField,
  Optional: OptionalField,
  validate,
};

export default Field;
