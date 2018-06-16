import { Maybe } from 'true-myth';

import Form, { FromModel } from '../src/form';
import Field, { Type } from '../src/field';
import Number from '../src/field/number';
import { minLength, maxLength, minValue } from '../src/validators';

import { assertType } from './helpers';
import { Validity } from '../src/validity';

type Person = {
  age: number;
  name?: string;
  familyName: Maybe<string>;
  middleName?: string;
};

const nameValidations = [minLength(1), maxLength(40)];

describe('`Form`', () => {
  test('`FromModel` functionality', () => {
    const fromUser: FromModel<Person> = user => ({
      age: Number.required({ type: Type.number, validators: [minValue(0)], value: user.age }),
      name: Field.optional({ validators: nameValidations, value: user.name }),
      familyName: Field.optional({ validators: nameValidations, value: user.familyName }),
      middleName: Field.optional()
    });

    const fromMaybeUser: FromModel<Maybe<Person>> = Maybe.match({
      Just: fromUser,
      Nothing: () => ({
        age: Number.required({ type: Type.number, validators: [minValue(0)] }),
        name: Field.optional({ validators: nameValidations }),
        familyName: Field.optional({ validators: nameValidations }),
        middleName: Field.optional<string>()
      })
    });

    const chris: Person = {
      name: 'Chris',
      age: 30,
      familyName: Maybe.just('Krycho')
    };

    const chrisForm = fromUser(chris);
    expect(chrisForm.age).toBeInstanceOf(Field.Required);
    expect(chrisForm.name).toBeInstanceOf(Field.Optional);
    expect(chrisForm.familyName).toBeInstanceOf(Field.Optional);

    const justChrisForm = fromMaybeUser(Maybe.just(chris));
    expect(JSON.stringify(justChrisForm)).toBe(JSON.stringify(chrisForm));

    const nobody: Maybe<Person> = Maybe.nothing();
    const nobodyForm = fromMaybeUser(nobody);
    expect(nobodyForm.age).toBeInstanceOf(Field.Required);
    expect(nobodyForm.name).toBeInstanceOf(Field.Optional);
    expect(nobodyForm.familyName).toBeInstanceOf(Field.Optional);

    assertType<Form<Person>>(chrisForm);
    assertType<Form<Person>>(nobodyForm);
  });

  const EMPTY: Form<Person> = {
    age: Field.required(),
    name: Field.optional(),
    familyName: Field.optional(),
    middleName: Field.optional()
  };

  const invalidAge = 12;
  const name = 'Joseph Campbell';
  const INVALID_REQUIRED: Form<Person> = {
    age: Field.required({ value: invalidAge, validators: [minValue(invalidAge + 1)] }),
    name: Field.optional(),
    familyName: Field.optional(),
    middleName: Field.optional()
  };

  const validAge = 18;
  const validAgeField = Field.required({
    value: validAge,
    validators: [minValue(validAge - 1, val => `${val}, ${validAge - 1}`)]
  });
  const INVALID_OPTIONAL: Form<Person> = {
    age: validAgeField,
    name: Field.optional({ value: name, validators: [maxLength(name.length - 1)] }),
    familyName: Field.optional(),
    middleName: Field.optional()
  };

  const VALID: Form<Person> = {
    age: validAgeField,
    name: Field.optional({ value: name, validators: [maxLength(name.length + 1)] }),
    familyName: Field.optional(),
    middleName: Field.optional()
  };

  describe('`Form.validate` function', () => {
    test('given an empty model', () => {
      const v = Form.validate(EMPTY);
      expect(v.isValid).toBe(false);
      expect(v.form.age.validity.type).toBe(Validity.Type.Invalid);
      expect(v.form.name.validity.type).toBe(Validity.Type.Valid);
      expect(v.form.familyName.validity.type).toBe(Validity.Type.Valid);
      expect(v.form.middleName.validity.type).toBe(Validity.Type.Valid);
    });

    test('given an invalid required field', () => {
      const v = Form.validate(INVALID_REQUIRED);
      expect(v.isValid).toBe(false);
      expect(v.form.age.validity.type).toBe(Validity.Type.Invalid);
      expect(v.form.name.validity.type).toBe(Validity.Type.Valid);
      expect(v.form.familyName.validity.type).toBe(Validity.Type.Valid);
      expect(v.form.middleName.validity.type).toBe(Validity.Type.Valid);
    });

    test('given an invalid optional field', () => {
      const v = Form.validate(INVALID_OPTIONAL);
      expect(v.isValid).toBe(false);
      expect(v.form.age.validity.type).toBe(Validity.Type.Valid);
      expect(v.form.name.validity.type).toBe(Validity.Type.Invalid);
      expect(v.form.familyName.validity.type).toBe(Validity.Type.Valid);
      expect(v.form.middleName.validity.type).toBe(Validity.Type.Valid);
    });

    test('given only valid fielsd or empty optional fields', () => {
      const v = Form.validate(VALID);
      expect(v.isValid).toBe(true);
      expect(v.form.age.validity.type).toBe(Validity.Type.Valid);
      expect(v.form.name.validity.type).toBe(Validity.Type.Valid);
      expect(v.form.familyName.validity.type).toBe(Validity.Type.Valid);
      expect(v.form.middleName.validity.type).toBe(Validity.Type.Valid);
    });
  });

  test('`Form.isValid` function', () => {
    expect(Form.isValid(EMPTY)).toBe(false);
    expect(Form.isValid(INVALID_REQUIRED)).toBe(false);
    expect(Form.isValid(INVALID_OPTIONAL)).toBe(false);
    expect(Form.isValid(VALID)).toBe(true);
  });
});
