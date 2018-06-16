const isVoid = (value: any) => value === undefined || value === null;

export enum Type {
  Unvalidated = 'Unvalidated',
  Invalid = 'Invalid',
  Valid = 'Valid'
}

let UNVALIDATED: Unvalidated;
export class Unvalidated {
  type: Type.Unvalidated = Type.Unvalidated;

  static create(): Unvalidated {
    if (isVoid(UNVALIDATED)) {
      UNVALIDATED = new Unvalidated();
    }

    return UNVALIDATED;
  }
}

export const unvalidated = Unvalidated.create;
export const isUnvalidated = (v: Validity): v is Unvalidated => v.type === Type.Unvalidated;

export class Invalid {
  type: Type.Invalid = Type.Invalid;

  constructor(readonly reason: string) {}

  static because(reason: string) {
    return new Invalid(reason);
  }
}

export const invalid = Invalid.because;
export const isInvalid = (v: Validity): v is Invalid => v.type === Type.Invalid;

let VALID: Valid;
export class Valid {
  type: Type.Valid = Type.Valid;

  static create() {
    if (isVoid(VALID)) {
      VALID = new Valid();
    }

    return VALID;
  }
}

export const valid = Valid.create;
export const isValid = (v: Validity): v is Valid => v.type === Type.Valid;

export type Validated = Invalid | Valid;
export const isValidated = (v: Validity): v is Validated => !isUnvalidated(v);

export type Validator<T> = (value: T) => Validated;

export type RequiredRule = <T>(...validators: Validator<T>[]) => (value?: T | null) => Validated[];

export type LazinessRule = <T>(validator: Validator<T>) => Validator<T>;

export const isMissing = (value: any): value is null | undefined | '' => {
  return isVoid(value) || (typeof value === 'string' && value.trim() === '');
};

export const required: RequiredRule = <T>(...validators: Validator<T>[]) => (value?: T | null) =>
  isMissing(value)
    ? [Invalid.because('field is required')]
    : validators.map(validate => validate(value));

export const optional: RequiredRule = <T>(...validators: Validator<T>[]) => (value?: T | null) =>
  isMissing(value) ? [valid()] : validators.map(validate => validate(value));

export type Validity = Unvalidated | Validated;
export const Validity = {
  Type,
  Unvalidated,
  unvalidated,
  isUnvalidated,
  isValidated,
  Invalid,
  invalid,
  isInvalid,
  Valid,
  valid,
  isValid,
  isMissing,
  required,
  optional
};

export default Validity;
