import { Maybe } from 'true-myth';

import Validity, { Validator, Validated, Invalid, Unvalidated, isMissing, valid } from './validity';

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

const _required = <T>(field: RequiredField<T>): Validated[] =>
  isMissing(field.value)
    ? [Invalid.because(field.messageIfMissing)]
    : field.validators.map(validate => validate(field.value!));

const _optional = <T>(field: OptionalField<T>): Validated[] =>
  isMissing(field.value) ? [valid()] : field.validators.map(validate => validate(field.value!));

const _validate = <T>(field: Field<T>): Validated[] =>
  field.isRequired ? _required(field) : _optional(field);

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
  Lazily,
  Eagerly
}

/**
  Validate a form field.

  The result of validating a `Field` is a new `Field` with the computed validity
  for the field passed in (`field` is never mutated).

  Validation may be performed "eagerly" or "lazily".
  
  - In eager validation, a field's validity always becomes `Invalid` or `Valid`,
    regardless of its initial valiidity.
  - In lazy validation, if the `validity` of `field` is `Unvalidated`, then it
    remains `Unvalidated` if the validation fails, or becomes `Valid` if the
    validation succeeds.

  This distinction is useful for times when it is not desirable to immediately
  treat a field as "invalid" while the user is entering information. For
  example, when validating an email address, the *partial* state -- when a user
  has typed `my-name@some-domain.` but has not yet typed the TLD -- it may not
  make sense to tell the user their email is invalid. After all: they *know* it
  is not yet valid, because they are still typing it in! In that case, you might
  validate the form lazily on `input` events but eagerly on `change` or `blur`
  events. In that flow, the user will be informed that their email is invalid
  if they:

  - have typed a valid email and then change it to be invalid
  - leave the form
  - have previously filled out the field and edit it and it is not valid

  However, it will *not* be invalid while the user is first typing in their
  email.
  
  @param field The `Field` to validate.
  @param eagerness Whether a `Field` currently in an `Unvalidated` state should
                   transition to `Invalid` if it is invalid, or remain
                   `Unvalidated`. By default, fields are validated eagerly.
 */
export function validate<T>(field: Field<T>, eagerness = Validate.Eagerly): Field<T> {
  const validities = _validate(field);

  // We eagerly validate *either* when configured to *or* when the field has
  // already been validated, since in that case any change to invalidity should
  // immediately be flagged to the user.
  const eagerlyValidate = eagerness === Validate.Eagerly || Validity.isValidated(field.validity);

  const onInvalid: OnInvalid = (reason: string) =>
    eagerlyValidate ? Validity.Invalid.because(reason) : Validity.unvalidated();

  const newValidity = toSingleValidity(validities, onInvalid);

  return { ...field, validity: newValidity };
}

export interface MinimalField<T> {
  value?: T;
  readonly type: Type;
  readonly validators: Validator<T>[];
  readonly validity: Validity;
}

export type RequiredFieldConfig<T> = Partial<{
  type: Type;
  validators: Array<Validator<T>>;
  value: T;
  messageIfMissing: string;
}>;

export const DEFAULT_MISSING_MESSAGE = 'field is required';

export class RequiredField<T> implements MinimalField<T> {
  readonly value?: T;

  readonly isRequired: true = true;

  readonly type: Type;
  readonly validators: Array<Validator<T>>;
  readonly validity: Validity;
  readonly messageIfMissing: string;

  constructor({
    type = Type.text,
    validators = [],
    value = undefined,
    messageIfMissing = DEFAULT_MISSING_MESSAGE
  }: RequiredFieldConfig<T> = {}) {
    this.type = type;
    this.value = value;
    this.validators = validators;
    this.messageIfMissing = messageIfMissing;
    this.validity = isMissing(this.value)
      ? Validity.unvalidated()
      : toSingleValidity(_validate(this));
  }
}

const required = <T>(config?: RequiredFieldConfig<T>) => new RequiredField(config);

export type OptionalFieldConfig<T> = Partial<{
  type: Type;
  validators: Array<Validator<T>>;
  value: T | Maybe<T>;
}>;

export class OptionalField<T> implements MinimalField<T> {
  readonly value?: T;

  readonly isRequired: false = false;

  readonly type: Type;
  readonly validators: Array<Validator<T>>;
  readonly validity: Validity;

  constructor({
    type = Type.text,
    validators = [],
    value = undefined
  }: OptionalFieldConfig<T> = {}) {
    if (Maybe.isInstance<T>(value)) {
      this.value = value.isJust() ? value.unsafelyUnwrap() : undefined;
    } else {
      this.value = value;
    }

    this.type = type;
    this.validators = validators;
    this.validity = isMissing(this.value)
      ? Validity.unvalidated()
      : toSingleValidity(_validate(this));
  }
}

const optional = <T>(config?: OptionalFieldConfig<T>) => new OptionalField(config);

export interface FieldConstructors<T> {
  required(options?: RequiredFieldConfig<T>): RequiredField<T>;
  optional(options?: OptionalFieldConfig<T>): OptionalField<T>;
}

export type Field<T> = RequiredField<T> | OptionalField<T>;

export const Field = {
  Required: RequiredField,
  Optional: OptionalField,
  Type,
  Validate,
  required,
  optional,
  validate
};

export default Field;
