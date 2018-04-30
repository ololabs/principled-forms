import Maybe, { Just, Nothing } from 'true-myth/maybe';

import Validity, { Validator, Validated, Invalid, Unvalidated, isMissing } from '../validity';

export enum Type {
  email = 'email',
  text = 'text',
  number = 'number',
  color = 'color',
  date = 'date',
  password = 'password',
  checkbox = 'checkbox',
  radio = 'radio'
}

const isMaybe = (v: any): v is Maybe<any> => v instanceof Just || v instanceof Nothing;

const _validate = <T>(field: Field<T>): Validated[] => {
  const rule = field.isRequired ? Validity.required : Validity.optional;
  return rule(...field.validators)(field.value);
};

type OnInvalid = (reason: string) => Unvalidated | Invalid;

const toSingleValidity = (
  validities: Validated[],
  onInvalid: OnInvalid = Validity.Invalid.because
) => {
  return validities.every(Validity.isValid)
    ? Validity.valid()
    : onInvalid(validities.find(Validity.isInvalid)!.reason); // at least one by definition
};

export enum Validate {
  Lazily = 'Lazily',
  Eagerly = 'Eagerly'
}

export function validate<T>(eagerness = Validate.Eagerly) {
  return (field: Field<T>): Field<T> => {
    const validities = _validate(field);

    // We eagerly validate *either* when configured to *or* when the field has
    // already been validated, since in that case any change to invalidity should
    // immediately be flagged to the user.
    const eagerlyValidate =
      eagerness === Validate.Eagerly ? Validity.isValidated(field.validity) : eagerness;

    const onInvalid: OnInvalid = (reason: string) =>
      eagerlyValidate ? Validity.Invalid.because(reason) : Validity.unvalidated();

    const newValidity = toSingleValidity(validities, onInvalid);

    return { ...field, validity: newValidity };
  };
}

// <Input @type={{@model.type}} @value={{@model.value}} />

export interface MinimalField<T> {
  value?: T;
  isRequired: boolean;
  readonly type: Type;
  readonly validators: Validator<T>[];
  readonly validity: Validity;
}

export type RequiredFieldConfig<T> = Partial<{
  type: Type;
  validators: Array<Validator<T>>;
  value: T;
}>;

export class RequiredField<T> implements MinimalField<T> {
  value?: T;

  isRequired: true = true;

  readonly type: Type;
  readonly validators: Array<Validator<T>>;
  readonly validity: Validity;

  constructor({
    type = Type.text,
    validators = [],
    value = undefined
  }: RequiredFieldConfig<T> = {}) {
    this.type = type;
    this.value = value;
    this.validators = validators;
    this.validity = isMissing(value) ? Validity.unvalidated() : toSingleValidity(_validate(this));
  }
}

const required = <T>(config?: RequiredFieldConfig<T>) => new RequiredField(config);

export type OptionalFieldConfig<T> = Partial<{
  type: Type;
  validators: Array<Validator<T>>;
  value: T | Maybe<T>;
}>;

export class OptionalField<T> implements MinimalField<T> {
  value?: T;

  isRequired: false = false;

  readonly type: Type;
  readonly validators: Array<Validator<T>>;
  readonly validity: Validity;

  constructor({
    type = Type.text,
    validators = [],
    value = undefined
  }: OptionalFieldConfig<T> = {}) {
    if (isMaybe(value)) {
      // Can this be `value.unwrapOr(undefined)`?
      this.value = value.isJust() ? value.unsafelyUnwrap() : undefined;
    } else {
      this.value = value;
    }

    this.type = type;
    this.validators = validators;
    this.validity = isMissing(value) ? Validity.valid() : toSingleValidity(_validate(this));
  }
}

const optional = <T>(config?: OptionalFieldConfig<T>) => new OptionalField(config);

export type Field<T> = RequiredField<T> | OptionalField<T>;

export interface FieldConstructors<T> {
  required(options?: RequiredFieldConfig<T>): RequiredField<T>;
  optional(options?: OptionalFieldConfig<T>): OptionalField<T>;
}

export const Field = {
  Required: RequiredField,
  Optional: OptionalField,
  required,
  optional,
  validate
};

export default Field;
