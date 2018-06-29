import { Maybe } from 'true-myth';

import Field, { OptionalField, RequiredField } from './field';
import Validity from './validity';
import { NonNullableFieldNames } from './type-utils';

/**
  Given a backing/persistence model, define the type of a corresponding form
  model.

  Optional fields and fields defined with the True Myth `Maybe` type are mapped
  to the `OptionalField` type. Non-optional fields are mapped to the
  `RequiredField` type.

  For example, given a `User` model from the persistence layer, defined
  so:

  ```ts
  export type User = {
    age: number;
    name?: string;
    homeTown: Maybe<string>;
    attributes: string[];
  };
  ```

  The type `Form<User>` is:

  ```ts
  type Form<User> = {
    age: RequiredField<number>;
    name: OptionalField<string>;
    homeTown: OptionalField<string>;
  }
  ```

  This is useful for constraining the type of a form model in your application.

  For example, you might do this at a top-level component in Ember.js 3.1+:

  ```ts
  import Component from '@ember/component';

  import Form from '@olo/forms/form';
  import Field, { Type } from '@olo/forms/field';
  import { minValue } from '@olo/forms/validators';

  import User from 'my-app/models/user';

  const modelFromUser: FromModel<User> = user => ({
    age: Field.required({ type: Type.number, value: user.age, validators: [minValue(13)] }),
    name: Field.optional({ value: user.name }),
    homeTown: Field.optional({ value: user.homeTown }),
  });

  export default class UserInfo extends Component {
    user!: User; // passed in as argument

    model = modelFromUser(this.user);

    @computed('model')
    get isValid(): boolean {
      return Form.isValid(this.model);
    }
  }
  ```

  Note that `model` here is *not* an Ember Data model, but the same `User` type
  given above; for notes on Ember Data types, see the `ember-principled-forms`
  documentation.
 */
export type Form<T> = Required<
  {
    [K in keyof T]: K extends NonNullableFieldNames<T>
      ? T[K] extends Maybe<infer U> ? OptionalField<U> : RequiredField<T[K]>
      : OptionalField<NonNullable<T[K]>>
  }
>;

export type FormProp<T> = keyof Form<T>;
export type FormValue<T> = Form<T>[FormProp<T>]['value'];

// Inspired by lodash's implementation.
type Dict<T> = { [K: string]: T };
function mapValues<T, U>(dict: Dict<T>, mapper: (value: T) => U): Dict<U> {
  const result: Dict<U> = {};
  Object.keys(dict).forEach(key => {
    result[key] = mapper(dict[key]);
  });
  return result;
}

type Validated<F> = { form: F; isValid: boolean };

/**
  Validate a form model.
  
  The validity of a form is the composition of the validity of all of its
  fields. If all fields are valid, the form is valid; if any fields are invalid,
  the form is invalid. `Field`s are always validated eagerly in the context of a
  form validation. (For more discussion, see the documentation of the `validate`
  function in the `field` module.)

  @param formToValidate A form model to validate. Treated as immutable.
  @return An object with a new `Form` derived from the passed-in-form by way of
          having all its fields validated, and the composite validity of those
          fields.
 */
export function validate<T, F extends Form<T>>(formToValidate: F): Validated<F> {
  // `mapValues` doesn't understand that F is indeed a dictionary, but we know it is.
  const form: F = mapValues(formToValidate as Dict<Field<any>>, Field.validate) as any;
  const isValid = (Object.values(form) as Field<any>[])
    .map(field => field.validity)
    .every(Validity.isValid);

  return { form, isValid };
}

export const isValid = <T, F extends Form<T>>(form: F): boolean => validate(form).isValid;

export type FromModel<T> = (
  model: T extends Maybe<infer U> ? Maybe<Partial<U>> : Partial<T>
) => Form<T extends Maybe<infer U> ? U : T>;

export const Form = {
  isValid,
  validate
};

export default Form;
