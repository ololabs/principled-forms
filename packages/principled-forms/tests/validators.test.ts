import V from '../src/validators';
import Validity, { Validator, Invalid } from '../src/validity';

describe('`validators`', () => {
  describe('`minLength`', () => {
    test('behavior', () => {
      const min = 3;
      const valid = 'hello';
      const invalid = 'hi';
      const v = V.minLength(min);
      expect(v).toBeInstanceOf(Function);
      expect(v(valid).type).toBe(Validity.Type.Valid);
      expect(v(invalid).type).toBe(Validity.Type.Invalid);
    });

    test('with default message', () => {
      const min = 3;
      expect((V.minLength(min)('hi') as Invalid).reason).toBe(`Must be at least ${min} characters`);
    });

    test('with custom message', () => {
      const min = 3;
      const message = (actual: number) =>
        `Cannot be fewer than ${min} characters long, but it was ${actual}.`;
      const invalid = 'hi';
      expect((V.minLength(min, message)(invalid) as Invalid).reason).toBe(message(invalid.length));
    });
  });

  describe('`maxLength`', () => {
    test('behavior', () => {
      const max = 3;
      const valid = 'hi';
      const invalid = 'hello';
      const v = V.maxLength(max);
      expect(v).toBeInstanceOf(Function);
      expect(v(valid).type).toBe(Validity.Type.Valid);
      expect(v(invalid).type).toBe(Validity.Type.Invalid);
    });

    test('with default message', () => {
      const max = 3;
      expect((V.maxLength(max)('hello') as Invalid).reason).toBe(
        `Must be at most ${max} characters`
      );
    });

    test('with custom message', () => {
      const max = 3;
      const message = (actual: number) =>
        `Cannot be more than ${max} characters long, but it was ${actual}.`;
      const invalid = 'hello';
      expect((V.maxLength(max, message)(invalid) as Invalid).reason).toBe(message(invalid.length));
    });
  });

  describe('`minValue`', () => {
    test('behavior', () => {
      const min = 3;
      const valid = 4;
      const invalid = 2;
      const v = V.minValue(min);
      expect(v).toBeInstanceOf(Function);
      expect(v(valid).type).toBe(Validity.Type.Valid);
      expect(v(invalid).type).toBe(Validity.Type.Invalid);
    });

    test('with default message', () => {
      const min = 3;
      expect((V.minValue(min)(2) as Invalid).reason).toBe(`Must be at least ${min}`);
    });

    test('with custom message', () => {
      const min = 3;
      const message = (actual: number) => `Cannot be fewer than ${min} long, but it was ${actual}.`;
      const invalid = 2;
      expect((V.minValue(min, message)(invalid) as Invalid).reason).toBe(message(invalid));
    });
  });

  describe('`maxValue`', () => {
    test('behavior', () => {
      const max = 3;
      const valid = 2;
      const invalid = 4;
      const v = V.maxValue(max);
      expect(v).toBeInstanceOf(Function);
      expect(v(valid).type).toBe(Validity.Type.Valid);
      expect(v(invalid).type).toBe(Validity.Type.Invalid);
    });

    test('with default message', () => {
      const max = 3;
      expect((V.maxValue(max)(4) as Invalid).reason).toBe(`Must be at most ${max}`);
    });

    test('with custom message', () => {
      const max = 3;
      const message = (actual: number) => `Cannot be more than ${max}, but it was ${actual}.`;
      const invalid = 4;
      expect((V.maxValue(max, message)(invalid) as Invalid).reason).toBe(message(invalid));
    });
  });

  test('regex', () => {
    const re = /\d+/;

    const message = (actual: string) => `Must be numbers, but was ${actual}`;
    const v = V.regex(re, message);

    expect(v('123').type).toBe(Validity.Type.Valid);

    const invalid = v('abc') as Invalid;
    expect(invalid.type).toBe(Validity.Type.Invalid);
    expect(invalid.reason).toBe(message('abc'));
  });
});
