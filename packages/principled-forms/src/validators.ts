import { valid, invalid, Validator, Validated } from './validity';

export const minLength = (min: number): Validator<string> => (
  value: string
): Validated =>
  value.length >= min ? valid() : invalid(`Must be at least ${min} characters`);

export const maxLength = (max: number): Validator<string> => (
  value: string
): Validated =>
  value.length <= max ? valid() : invalid(`Must be at most ${max} characters`);

export const minValue = (min: number): Validator<number> => (value: number) =>
  value >= min ? valid() : invalid(`Must be at least ${min}`);

export const maxValue = (max: number): Validator<number> => (value: number) =>
  value <= max ? valid() : invalid(`Must be at most ${max}`);

export const regex = (
  re: RegExp,
  err: (val: string) => string
): Validator<string> => (value: string) =>
  re.test(value) ? valid() : invalid(err(value));
