import { valid, invalid, Validator, Validated } from './validity';

type ErrMessage<T> = (val: T) => string;

const defaultInvalid = <T>(fallback: string, requirement: T, err?: ErrMessage<T>) =>
  invalid(err ? err(requirement) : fallback);

export const minLength = (min: number, err?: ErrMessage<number>): Validator<string> => (
  value: string
): Validated =>
  value.length >= min ? valid() : defaultInvalid(`Must be at least ${min} characters`, min, err);

export const maxLength = (max: number, err?: ErrMessage<number>): Validator<string> => (
  value: string
): Validated =>
  value.length <= max ? valid() : defaultInvalid(`Must be at most ${max} characters`, max, err);

export const minValue = (min: number, err?: ErrMessage<number>): Validator<number> => (
  value: number
) => (value >= min ? valid() : defaultInvalid(`Must be at least ${min}`, min, err));

export const maxValue = (max: number, err?: ErrMessage<number>): Validator<number> => (
  value: number
) => (value <= max ? valid() : defaultInvalid(`Must be at most ${max}`, max, err));

export const regex = (re: RegExp, err: ErrMessage<string>): Validator<string> => (value: string) =>
  re.test(value) ? valid() : invalid(err(value));
