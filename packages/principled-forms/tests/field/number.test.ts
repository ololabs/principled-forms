import Field from '../../src/field';
import Number from '../../src/field/number';

describe('`number` module', () => {
  test('`optional` constructor has the right field type', () => {
    const e = Number.optional();
    expect(e.type).toBe(Field.Type.number);
  });

  test('`required` constructor has the right field type', () => {
    const e = Number.required();
    expect(e.type).toBe(Field.Type.number);
  });
});
