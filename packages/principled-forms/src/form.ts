import { Maybe } from 'true-myth';
import { every } from 'lodash/fp';

import Field, { OptionalField, RequiredField, InputTypes } from './field';
import Validity from './validity';
import { NonNullableFieldNames } from './type-utils';

/**
  Map the fields on an type to a new type whose type values are:

  - `OptionalField<T>` if the original type is a `Maybe<T>` or an optional `T`
    (i.e. `field?: T`) if `T` belongs to `InputTypes`
  - `RequiredField<T>` if the original type is simply `T` and `T` belongs to
    `InputTypes`
  - `never` for all other fields

  where `InputTypes` is `boolean | number | string`.

  For example, given a `User` type defined like this:

  ```ts
  type User = {
    age: number;
    name?: string;
    description: Maybe<string>;
    attributes: string[];
  };
  ```

  Then `Fields<User>` has the type:

  ```ts
  type Fields<User> = {
    age: RequiredField<number>;
    name: OptionalField<string>;
    description: OptionalField<String>;
    attributes: never;
  }
  ```
 */
export type Fields<T> = Required<
  {
    [K in keyof T]: K extends NonNullableFieldNames<T>
      ? T[K] extends Maybe<infer U>
        ? U extends InputTypes ? OptionalField<U> : never
        : T[K] extends infer V ? (V extends InputTypes ? RequiredField<V> : never) : never
      : T[K] extends infer W ? (W extends InputTypes ? OptionalField<W> : never) : never
  }
>;

/**
  Get the property names for only the properties whose types are not marked as
  `never` by `Fields`. Used in conjunction with `ValidFields`.
 */
export type ValidFieldNames<T> = { [K in keyof T]: T[K] extends never ? never : K }[keyof T];

/**
  Using the set of property names for non-`never` types given by
  `ValidFieldNames`, create a mapped type consisting of the fields in `Fields`
  whose original types in a model are all in `InputTypes`. Not useful unless the
  type parameter is `Fields`.
 */
export type ValidFields<T> = Pick<T, ValidFieldNames<T>>;

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
export type Form<T> = ValidFields<Fields<T>>;

export const isValid = <T, K extends keyof Form<T>>(form: Form<T>): boolean =>
  (Object.keys(form) as K[])
    .map(key => form[key])
    .map(field =>
      // @ts-ignore -- `field` here *is* guaranteed to always be `InputTypes`,
      // because of the constraints on `Form`, but TS has lost track of that
      // information along the way.
      Field.validate(field)
    )
    .map(field => field.validity)
    .map(every(Validity.isValid))
    .reduce((allValid, validity) => allValid && validity, true); // flatMap

export type FromModel<T> = (
  model: T extends Maybe<infer U> ? Maybe<U> : T
) => Form<T extends Maybe<infer U> ? U : T>;

export const Form = {
  isValid,
};
