import Validity from '../src/validity';

describe('`validity` module', () => {
  test('`isUnvalidated` function', () => {
    const unvalidated = Validity.unvalidated();
    expect(Validity.isUnvalidated(unvalidated)).toBe(true);
    const invalid = Validity.invalid('wat');
    expect(Validity.isUnvalidated(invalid)).toBe(false);
    const valid = Validity.valid();
    expect(Validity.isUnvalidated(valid)).toBe(false);
  });

  test('`isInvalid` function', () => {
    const unvalidated = Validity.unvalidated();
    expect(Validity.isInvalid(unvalidated)).toBe(false);
    const invalid = Validity.invalid('wat');
    expect(Validity.isInvalid(invalid)).toBe(true);
    const valid = Validity.valid();
    expect(Validity.isInvalid(valid)).toBe(false);
  });

  test('`isValid` function', () => {
    const unvalidated = Validity.unvalidated();
    expect(Validity.isValid(unvalidated)).toBe(false);
    const invalid = Validity.invalid('wat');
    expect(Validity.isValid(invalid)).toBe(false);
    const valid = Validity.valid();
    expect(Validity.isValid(valid)).toBe(true);
  });

  test('`isValidated` function', () => {
    const unvalidated = Validity.unvalidated();
    expect(Validity.isValidated(unvalidated)).toBe(false);
    const invalid = Validity.invalid('wat');
    expect(Validity.isValidated(invalid)).toBe(true);
    const valid = Validity.valid();
    expect(Validity.isValidated(valid)).toBe(true);
  });

  test('`isMissing` function', () => {
    expect(Validity.isMissing(undefined)).toBe(true);
    expect(Validity.isMissing(null)).toBe(true);
    expect(Validity.isMissing('')).toBe(true);
    expect(Validity.isMissing('    ')).toBe(true);
    expect(Validity.isMissing('anything')).toBe(false);
    expect(Validity.isMissing(12)).toBe(false);
  });
});
