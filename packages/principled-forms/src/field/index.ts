import Validity, { Validator, required, optional, Validated } from '../validity';

export enum Type {
  email = 'email',
  text = 'text',
  number = 'number',
  color = 'color',
  date = 'date',
  password = 'password',
}

const validate = <T>(field: Field<T>): Validated[] => {
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

export interface RequiredField<T> extends MinimalField<T> {
  isRequired: true;
}

export interface OptionalField<T> extends MinimalField<T> {
  isRequired: false;
}

export type Field<T> = RequiredField<T> | OptionalField<T>;

// TODO: Consider renaming to `InputFieldModel` or `FieldModelBase`.
// I think it's important to keep `Model` in the name to avoid confusion.
export class InputField<T> implements MinimalField<T> {
  value?: T;
  isRequired!: boolean;

  get validities(): Validity[] {
    return validate(this as Field<T>);
  }

  static required<T>(type: Type, validators: Array<Validator<T>>, value?: T): RequiredField<T> {
    const instance = new InputField(type, validators, value);
    instance.isRequired = true;
    return instance as RequiredField<T>;
  }

  static optional<T>(type: Type, validators: Array<Validator<T>>, value?: T): OptionalField<T> {
    const instance = new InputField(type, validators, value);
    instance.isRequired = false;
    return instance as OptionalField<T>;
  }

  private constructor(readonly type: Type, readonly validators: Array<Validator<T>>, value?: T) {
    this.value = value;
  }
}

export interface FieldConstructor<T> {
  required(...args: any[]): RequiredField<T>;
  optional(...args: any[]): OptionalField<T>;
}

export const Field = {
  InputField,
  Number,
  validate,
};

export default Field;
