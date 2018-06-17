import Field from '../../src/field';
import { Invalid, Valid, Validity } from '../../src/validity';
import { minValue } from '../../src/validators';

/*
export const Field = {
  Required: RequiredField,
  Optional: OptionalField,
  required,
  optional,
  validate
};
 */

describe('`field` module', () => {
  describe('`required` function', () => {
    test('with no arguments', () => {
      const validated = Field.validate(Field.required<number>());
      expect(validated.validity.type).toBe(Validity.Type.Invalid);
      expect((validated.validity as Invalid).reason).toBe('field is required');
    });

    test('with arguments', () => {
      const unset = Field.validate(Field.required({ validators: [minValue(10)] }));
      expect(unset.validity.type).toBe(Validity.Type.Invalid);
      expect((unset.validity as Invalid).reason).toBe('field is required');

      const tooYoung = Field.validate(Field.required({ value: 16, validators: [minValue(18)] }));
      expect(tooYoung.validity.type).toBe(Validity.Type.Invalid);
      expect((tooYoung.validity as Invalid).reason).toBe('Must be at least 18');

      const oldEnough = Field.validate(Field.required({ value: 21, validators: [minValue(18)] }));
      expect(oldEnough.validity.type).toBe(Validity.Type.Valid);
    });
  });

  describe('`optional` function', () => {
    test('with no arguments', () => {
      const f = Field.optional();

      expect(Field.validate(f).validity).toBeInstanceOf(Valid);
    });

    test('with arguments', () => {
      const f = Field.optional({ type: Field.Type.text, value: 'what' });
    });
  });

  describe('`validate` function', () => {
    test('with `Validate.Eagerly`', () => {});

    test('with `Validate.Lazily', () => {});
  });
});
