import { valid, invalid } from './validity';
const defaultInvalid = (fallback, requirement, err) => invalid(err ? err(requirement) : fallback);
export const minLength = (min, err) => (value) => value.length >= min ? valid() : defaultInvalid(`Must be at least ${min} characters`, min, err);
export const maxLength = (max, err) => (value) => value.length <= max ? valid() : defaultInvalid(`Must be at most ${max} characters`, max, err);
export const minValue = (min, err) => (value) => (value >= min ? valid() : defaultInvalid(`Must be at least ${min}`, min, err));
export const maxValue = (max, err) => (value) => (value <= max ? valid() : defaultInvalid(`Must be at most ${max}`, max, err));
export const regex = (re, err) => (value) => re.test(value) ? valid() : invalid(err(value));
