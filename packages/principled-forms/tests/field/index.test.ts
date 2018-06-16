import Field from '../../src/field';
import { Invalid, Valid } from '../../src/validity';

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
      const f = Field.required();
    });

    test('with arguments', () => {
      const f = Field.required({ type: Field.Type.text, value: 'what' });
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

  test('`validate` function', () => {});
});
