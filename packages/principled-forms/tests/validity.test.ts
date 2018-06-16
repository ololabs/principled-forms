import Validity, { Invalid, Valid } from '../src/validity';
import { minValue, maxValue } from '../src/validators';

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

  describe('`required` function', () => {
    test('without rules', () => {
      const validation = Validity.required<number>();

      const missing = validation(undefined);
      expect(missing.length).toBe(1);
      expect(missing[0]).toBeInstanceOf(Invalid);
      expect((missing[0] as Invalid).reason).toBe('field is required');

      const present = validation(12);
      expect(present.length).toBe(0);
    });

    test('with rules', () => {
      const min = 10;
      const max = 20;
      const valid = 15;
      const rules = [minValue(min), maxValue(max)];
      const validation = Validity.required(...rules);

      const missing = validation(undefined);
      expect(missing.length).toBe(1);
      expect(missing[0]).toBeInstanceOf(Invalid);
      expect((missing[0] as Invalid).reason).toBe('field is required');

      const tooLow = validation(min - 1);
      expect(tooLow.length).toBe(rules.length);
      expect(tooLow[0]).toBeInstanceOf(Invalid);
      expect((tooLow[0] as Invalid).reason).toBe(`Must be at least ${min}`);
      expect(tooLow[1]).toBeInstanceOf(Valid);

      const tooHigh = validation(max + 1);
      expect(tooHigh.length).toBe(rules.length);
      expect(tooHigh[0]).toBeInstanceOf(Valid);
      expect(tooHigh[1]).toBeInstanceOf(Invalid);
      expect((tooHigh[1] as Invalid).reason).toBe(`Must be at most ${max}`);

      const okay = validation(valid);
      expect(okay.length).toBe(rules.length);
      okay.forEach(v => expect(v).toBeInstanceOf(Valid));
    });
  });

  describe('`optional` function', () => {
    test('without rules', () => {
      const validation = Validity.optional<number>();

      const missing = validation(undefined);
      expect(missing.length).toBe(1);
      expect(missing[0].type).toBe(Validity.Type.Valid);

      const present = validation(12);
      expect(present.length).toBe(0);
    });

    test('with rules', () => {
      const min = 10;
      const max = 20;
      const valid = 15;
      const rules = [minValue(min), maxValue(max)];
      const validation = Validity.optional(...rules);

      const missing = validation(undefined);
      expect(missing.length).toBe(1);
      expect(missing[0].type).toBe(Validity.Type.Valid);

      const tooLow = validation(min - 1);
      expect(tooLow.length).toBe(rules.length);
      expect(tooLow[0].type).toBe(Validity.Type.Invalid);
      expect((tooLow[0] as Invalid).reason).toBe(`Must be at least ${min}`);
      expect(tooLow[1].type).toBe(Validity.Type.Valid);

      const tooHigh = validation(max + 1);
      expect(tooHigh.length).toBe(rules.length);
      expect(tooHigh[0].type).toBe(Validity.Type.Valid);
      expect(tooHigh[1].type).toBe(Validity.Type.Invalid);
      expect((tooHigh[1] as Invalid).reason).toBe(`Must be at most ${max}`);

      const okay = validation(valid);
      expect(okay.length).toBe(rules.length);
      okay.forEach(v => expect(v.type).toBe(Validity.Type.Valid));
    });
  });
});
