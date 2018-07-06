import Field from '../../src/field';
import Email from '../../src/field/email';
import { Validity } from '../../src';
import { minLength } from '../../src/validators';
import { Invalid, valid } from '../../src/validity';

const noWReason = '\'w\'s are not allowed';
const noW = (value: string) => (value.includes('w') ? Invalid.because(noWReason) : valid());

describe('`email` module', () => {
  describe('`optional` constructor', () => {
    test('has the right field type', () => {
      const e = Email.optional();
      expect(e.type).toBe(Field.Type.email);
    });

    describe('includes basic `email` validation', () => {
      test('empty fields are unvalidated', () => {
        expect(Email.optional().validity.type).toBe(Validity.Type.Unvalidated);
      });

      test('invalid strings are rejected', () => {
        const invalid = Email.optional({ value: 'potato' });
        expect(invalid.validity.type).toBe(Validity.Type.Invalid);
        expect((invalid.validity as Invalid).reason).toBe('potato is not a valid email address');
      });

      test('valid emails are accepted', () => {
        expect(Email.optional({ value: 'hello@example.com' }).validity.type).toBe(
          Validity.Type.Valid
        );
      });
    });

    describe('composes with other string validations', () => {
      test('`minLength`', () => {
        const base = Email.optional({ validators: [minLength(10)] });

        const tooShort = Field.validate({ ...base, value: 'hey@c.co' });
        expect(tooShort.validity.type).toBe(Validity.Type.Invalid);
        expect((tooShort.validity as Invalid).reason).toBe('Must be at least 10 characters');

        const notAnEmail = Field.validate({ ...base, value: 'long but wrong' });
        expect(notAnEmail.validity.type).toBe(Validity.Type.Invalid);
        expect((notAnEmail.validity as Invalid).reason).toBe(
          'long but wrong is not a valid email address'
        );

        const valid = Field.validate({ ...base, value: 'hello@example.com' });
        expect(valid.validity.type).toBe(Validity.Type.Valid);
      });

      test('arbitrary', () => {
        const base = Email.required({ validators: [noW] });

        const hasW = Field.validate({ ...base, value: 'waffles@example.com' });
        expect(hasW.validity.type).toBe(Validity.Type.Invalid);
        expect((hasW.validity as Invalid).reason).toBe(noWReason);

        const hasNoW = Field.validate({ ...base, value: 'hello@example.com' });
        expect(hasNoW.validity.type).toBe(Validity.Type.Valid);
      });
    });

    test('custom email validation message', () => {
      const emailMessage = (suppliedEmail: string) => `Ugh. ${suppliedEmail} is *not* an email.`;
      expect(Field.validate(Email.optional({ value: 'wat', emailMessage })));
    });
  });

  describe('`required` constructor', () => {
    test('has the right field type', () => {
      const e = Email.required();
      expect(e.type).toBe(Field.Type.email);
    });

    describe('includes basic `email` validation', () => {
      test('empty fields are unvalidated', () => {
        expect(Email.required().validity.type).toBe(Validity.Type.Unvalidated);
      });

      test('invalid strings are rejected', () => {
        const invalid = Email.required({ value: 'potato' });
        expect(invalid.validity.type).toBe(Validity.Type.Invalid);
        expect((invalid.validity as Invalid).reason).toBe('potato is not a valid email address');
      });

      test('valid emails are accepted', () => {
        expect(Email.required({ value: 'hello@example.com' }).validity.type).toBe(
          Validity.Type.Valid
        );
      });
    });

    describe('composes with other string validations', () => {
      test('`minLength`', () => {
        const base = Email.required({ validators: [minLength(10)] });

        const tooShort = Field.validate({ ...base, value: 'hey@c.co' });
        expect(tooShort.validity.type).toBe(Validity.Type.Invalid);
        expect((tooShort.validity as Invalid).reason).toBe('Must be at least 10 characters');

        const notAnEmail = Field.validate({ ...base, value: 'long but wrong' });
        expect(notAnEmail.validity.type).toBe(Validity.Type.Invalid);
        expect((notAnEmail.validity as Invalid).reason).toBe(
          'long but wrong is not a valid email address'
        );

        const valid = Field.validate({ ...base, value: 'hello@example.com' });
        expect(valid.validity.type).toBe(Validity.Type.Valid);
      });

      test('arbitrary', () => {
        const base = Email.required({ validators: [noW] });

        const hasW = Field.validate({ ...base, value: 'waffles@example.com' });
        expect(hasW.validity.type).toBe(Validity.Type.Invalid);
        expect((hasW.validity as Invalid).reason).toBe(noWReason);

        const hasNoW = Field.validate({ ...base, value: 'hello@example.com' });
        expect(hasNoW.validity.type).toBe(Validity.Type.Valid);
      });
    });

    test('custom email validation message', () => {
      const emailMessage = (suppliedEmail: string) => `Ugh. ${suppliedEmail} is *not* an email.`;
      expect(Field.validate(Email.required({ value: 'wat', emailMessage })));
    });
  });
});
