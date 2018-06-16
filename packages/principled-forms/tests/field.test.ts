import Field, { Validate } from '../src/field';
import { Invalid, Valid, Validity } from '../src/validity';
import { minValue, minLength } from '../src/validators';
import { Maybe } from 'true-myth';

describe('`field` module', () => {
  describe('`required` function', () => {
    test('with no arguments', () => {
      const validated = Field.validate(Field.required<number>());
      expect(validated.validity.type).toBe(Validity.Type.Invalid);
      expect((validated.validity as Invalid).reason).toBe('field is required');
    });

    describe('with validators', () => {
      test('with no value', () => {
        const unset = Field.validate(Field.required({ validators: [minValue(10)] }));
        expect(unset.validity.type).toBe(Validity.Type.Invalid);
        expect((unset.validity as Invalid).reason).toBe('field is required');
      });

      test('with wrong value', () => {
        const tooYoung = Field.validate(Field.required({ value: 16, validators: [minValue(18)] }));
        expect(tooYoung.validity.type).toBe(Validity.Type.Invalid);
        expect((tooYoung.validity as Invalid).reason).toBe('Must be at least 18');
      });

      test('with valid value', () => {
        const oldEnough = Field.validate(Field.required({ value: 21, validators: [minValue(18)] }));
        expect(oldEnough.validity.type).toBe(Validity.Type.Valid);
      });
    });
  });

  describe('`optional` function', () => {
    test('with no arguments', () => {
      const f = Field.optional();

      expect(Field.validate(f).validity).toBeInstanceOf(Valid);
    });

    describe('with validators', () => {
      test('with no value', () => {
        const unset = Field.validate(Field.optional({ validators: [minValue(10)] }));
        expect(unset.validity.type).toBe(Validity.Type.Valid);
      });

      test('with wrong value', () => {
        const tooYoung = Field.validate(Field.optional({ value: 16, validators: [minValue(18)] }));
        expect(tooYoung.validity.type).toBe(Validity.Type.Invalid);
        expect((tooYoung.validity as Invalid).reason).toBe('Must be at least 18');
      });

      test('with valid value', () => {
        const oldEnough = Field.validate(Field.optional({ value: 21, validators: [minValue(18)] }));
        expect(oldEnough.validity.type).toBe(Validity.Type.Valid);
      });
    });
  });

  describe('`validate` function', () => {
    describe('with `Validate.Eagerly`', () => {
      test('for `optional` fields', () => {
        const unset = Field.validate(
          Field.optional({ validators: [minValue(10)] }),
          Validate.Eagerly
        );
        expect(unset.validity.type).toBe(Validity.Type.Valid);

        const unvalidatedInvalid = Field.validate(
          Field.optional({ validators: [minValue(10)], value: 5 }),
          Validate.Eagerly
        );
        expect(unvalidatedInvalid.validity.type).toBe(Validity.Type.Invalid);

        const unvalidatedValid = Field.validate(
          Field.optional({ validators: [minValue(10)], value: 20 }),
          Validate.Eagerly
        );
        expect(unvalidatedValid.validity.type).toBe(Validity.Type.Valid);
      });

      test('for `required` fields', () => {
        const unset = Field.validate(
          Field.required({ validators: [minValue(10)] }),
          Validate.Eagerly
        );
        expect(unset.validity.type).toBe(Validity.Type.Invalid);

        const unvalidatedInvalid = Field.validate(
          Field.required({ validators: [minValue(10)], value: 5 }),
          Validate.Eagerly
        );
        expect(unvalidatedInvalid.validity.type).toBe(Validity.Type.Invalid);

        const unvalidatedValid = Field.validate(
          Field.required({ validators: [minValue(10)], value: 20 }),
          Validate.Eagerly
        );
        expect(unvalidatedValid.validity.type).toBe(Validity.Type.Valid);
      });
    });

    describe('with `Validate.Lazily', () => {
      describe('for `optional` fields', () => {
        test('no value is `Valid`', () => {
          const unset = Field.validate(
            Field.optional({ validators: [minValue(10)] }),
            Validate.Lazily
          );
          expect(unset.validity.type).toBe(Validity.Type.Valid);
        });

        test('a bad value is `Invalid`', () => {
          const badValue = Field.validate(
            Field.optional({ validators: [minValue(10)], value: 5 }),
            Validate.Lazily
          );
          expect(badValue.validity.type).toBe(Validity.Type.Invalid);
        });

        test('a good value is `Valid`', () => {
          const unvalidatedValid = Field.validate(
            Field.optional({ validators: [minValue(10)], value: 20 }),
            Validate.Lazily
          );
          expect(unvalidatedValid.validity.type).toBe(Validity.Type.Valid);
        });

        test('transitions between states correctly', () => {
          const initial = Field.optional({ validators: [minLength(10)] });
          expect(initial.validity.type).toBe(Validity.Type.Unvalidated);

          const notYetValid = Field.validate({ ...initial, value: 'short' }, Validate.Lazily);
          expect(notYetValid.validity.type).toBe(Validity.Type.Unvalidated);

          const nowValid = Field.validate(
            { ...notYetValid, value: 'now long enough' },
            Validate.Lazily
          );
          expect(nowValid.validity.type).toBe(Validity.Type.Valid);

          const backToInvalid = Field.validate({ ...nowValid, value: 'short' }, Validate.Lazily);
          expect(backToInvalid.validity.type).toBe(Validity.Type.Invalid);

          const backToValid = Field.validate(
            { ...backToInvalid, value: 'now long enough' },
            Validate.Lazily
          );
          expect(backToValid.validity.type).toBe(Validity.Type.Valid);
        });
      });

      describe('for `required` fields', () => {
        test('no value is `Unvalidated', () => {
          const unset = Field.validate(
            Field.required({ validators: [minValue(10)] }),
            Validate.Lazily
          );
          expect(unset.validity.type).toBe(Validity.Type.Unvalidated);
        });

        test('a bad value is `Invalid`', () => {
          const unvalidatedInvalid = Field.validate(
            Field.required({ validators: [minValue(10)], value: 5 }),
            Validate.Lazily
          );
          expect(unvalidatedInvalid.validity.type).toBe(Validity.Type.Invalid);
        });

        test('a good value is `Valid`', () => {
          const unvalidatedValid = Field.validate(
            Field.required({ validators: [minValue(10)], value: 20 }),
            Validate.Lazily
          );
          expect(unvalidatedValid.validity.type).toBe(Validity.Type.Valid);
        });

        test('transitions between states correctly', () => {
          const initial = Field.required({ validators: [minLength(10)] });
          expect(initial.validity.type).toBe(Validity.Type.Unvalidated);

          const notYetValid = Field.validate({ ...initial, value: 'short' }, Validate.Lazily);
          expect(notYetValid.validity.type).toBe(Validity.Type.Unvalidated);

          const nowValid = Field.validate(
            { ...notYetValid, value: 'now long enough' },
            Validate.Lazily
          );
          expect(nowValid.validity.type).toBe(Validity.Type.Valid);

          const backToInvalid = Field.validate({ ...nowValid, value: 'short' }, Validate.Lazily);
          expect(backToInvalid.validity.type).toBe(Validity.Type.Invalid);

          const backToValid = Field.validate(
            { ...backToInvalid, value: 'now long enough' },
            Validate.Lazily
          );
          expect(backToValid.validity.type).toBe(Validity.Type.Valid);
        });
      });
    });
  });

  describe('with `Maybe` fields', () => {
    describe('in `optional` fields', () => {
      test('treats `Nothing` as value-less', () => {
        expect(Field.optional({ value: Maybe.nothing() }).value).toBe(undefined);
      });

      test('treats `Just` as its value', () => {
        let just = Maybe.just(5);
        expect(Field.optional({ value: just }).value).toBe(5);
      });
    });

    describe('in `required` fields', () => {
      test('treats `Nothing` as an actual value', () => {
        expect(Field.required({ value: Maybe.nothing() }).value!.variant).toBe(
          Maybe.Variant.Nothing
        );
      });

      test('treats `Just` as an actual value', () => {
        let just = Maybe.just(5);
        let field = Field.required({ value: just });
        expect(field.value!.variant).toBe(Maybe.Variant.Just);
      });
    });
  });
});
