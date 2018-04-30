import { Maybe } from 'true-myth';

import Field, { OptionalField, RequiredField, Validate } from './field';
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
    description: Maybe<string>;
    attributes: string[];
  };
  ```

  The type `Form<User>` is:

  ```ts
  type Form<User> = {
    age: RequiredField<number>;
    name: OptionalField<string>;
    description: OptionalField<string>;
  }
  ```

  This is useful for constraining the type of a form model in your application.

  For example, you might do this at a top-level component in Ember.js (3.1+):

  ```ts
  import Component from '@ember/component';

  import Form from '@olo/forms/form';
  import Field, { Type } from '@olo/forms/field';
  import { minValue } from '@olo/forms/validators';

  import User from 'my-app/models/user';

  const modelFromUser: FromModel<User> = user => ({
    age: Field.required({ type: Type.number, value: user.age, validators: [minValue(0)] }),
    name: Field.optional({ value: user.name }),
    description: Field.optional({ value: user.description }),
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

  Note that if the persistence layer model here is an Ember Data model, it
  _must_ be using ES6 class syntax with Ember Decorators in Ember 3.1+ for this
  to work, since otherwise its types are `ComputedProperty` instances. Types
  which do not have class properties on them will Just Work™.
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

export const isValid = <T, F extends Form<T>, K extends keyof F>(form: F): boolean =>
  (Object.keys(form) as K[])
    .map(key => form[key] as Field<any>) // `any` b/c TS loses mapped type context here
    .map(Field.validate(Validate.Eagerly))
    .map(field => field.validity)
    .map(Validity.isValid)
    .reduce((allValid, validity) => allValid && validity, true); // flatMap

export type FromModel<T> = (
  model: T extends Maybe<infer U> ? Maybe<U> : T
) => Form<T extends Maybe<infer U> ? U : T>;

export const Form = {
  isValid
};

export default Form;
