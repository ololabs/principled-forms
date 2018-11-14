import { valid, invalid, Validator, Validated } from './validity';

export type ErrMessage<T> = (actual: T) => string;

const defaultInvalid = <T>(fallback: string, actual: T, err?: ErrMessage<T>) =>
  invalid(err ? err(actual) : fallback);

export const equal = <T>(
  comparisonValue: T,
  messageIfNotEqual?: (value: T, comparisonValue: T) => string
): Validator<T> => (value: T) =>
  comparisonValue === value
    ? valid()
    : invalid(
        messageIfNotEqual
          ? messageIfNotEqual(value, comparisonValue)
          : `${value} is not equal to ${comparisonValue}`
      );

export const minLength = (min: number, err?: ErrMessage<number>): Validator<string> => (
  value: string
): Validated =>
  value.length >= min
    ? valid()
    : defaultInvalid(`Must be at least ${min} characters`, value.length, err);

export const maxLength = (max: number, err?: ErrMessage<number>): Validator<string> => (
  value: string
): Validated =>
  value.length <= max
    ? valid()
    : defaultInvalid(`Must be at most ${max} characters`, value.length, err);

export const minValue = (min: number, err?: ErrMessage<number>): Validator<number> => (
  value: number
) => (value >= min ? valid() : defaultInvalid(`Must be at least ${min}`, value, err));

export const maxValue = (max: number, err?: ErrMessage<number>): Validator<number> => (
  value: number
) => (value <= max ? valid() : defaultInvalid(`Must be at most ${max}`, value, err));

const defaultPhoneMessage: ErrMessage<string> = actual => `${actual} is not a valid phone number`;

export const phone = (message = defaultPhoneMessage): Validator<string> =>
  regex(/^\(?\d{3}\)?([\s-])?\d{3}([\s-])?\d{4}\s?$/, message);

export const regex = (re: RegExp, err: ErrMessage<string>): Validator<string> => (value: string) =>
  re.test(value) ? valid() : invalid(err(value));

export const truthful = (messageIfFalse: string): Validator<boolean> => (value: boolean) =>
  value ? valid() : invalid(messageIfFalse);

export const Validators = {
  equal,
  minLength,
  maxLength,
  minValue,
  maxValue,
  phone,
  regex,
  truthful
};

export default Validators;
