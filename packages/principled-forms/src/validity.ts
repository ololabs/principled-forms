import { isVoid } from 'true-myth/utils';

export enum Type {
  Unvalidated,
  Invalid,
  Valid,
}

let UNVALIDATED: Unvalidated;
export class Unvalidated {
  type: Type.Unvalidated = Type.Unvalidated;
  private constructor() {}
  static create(): Unvalidated {
    if (isVoid(UNVALIDATED)) {
      UNVALIDATED = new Unvalidated();
    }

    return UNVALIDATED;
  }
}

export const unvalidated = Unvalidated.create;

export class Invalid {
  type: Type.Invalid = Type.Invalid;

  static because(reason: string) {
    return new Invalid(reason);
  }

  private constructor(readonly reason: string) {}
}

export const invalid = Invalid.because;
export const isInvalid = (v: Validity): v is Invalid => v.type === Type.Invalid;

let VALID: Valid;
export class Valid {
  type: Type.Valid = Type.Valid;

  private constructor() {}

  static create() {
    if (isVoid(VALID)) {
      VALID = new Valid();
    }

    return VALID;
  }
}

export const valid = Valid.create;

export type Validated = Invalid | Valid;

export type Validator<T> = (value: T) => Validated;

export type Rule = <T>(
  ...validators: Validator<T>[]
) => (value?: T | null) => Validated[];

export const required: Rule = <T>(...validators: Validator<T>[]) => (
  value?: T | null
) =>
  isVoid(value)
    ? [Invalid.because('field is required')]
    : validators.map(validate => validate(value));

export const optional: Rule = <T>(...validators: Validator<T>[]) => (
  value?: T | null
) => (isVoid(value) ? [valid()] : validators.map(validate => validate(value)));

export type Validate<T> = (value?: T | null) => Validated[];

export type Validity = Unvalidated | Validated;
export const Validity = {
  Type,
  Unvalidated,
  Invalid,
  Valid,
  unvalidated,
  invalid,
  isInvalid,
  valid,
  Rule,
  required,
  optional,
};

export default Validity;
