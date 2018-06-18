import { mapValues } from 'lodash/fp';
import { Maybe } from 'true-myth';

import Field, { OptionalField, RequiredField } from './field';
import Validity, { Type } from './validity';
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
type FormModel<T> = Required<
  {
    [K in keyof T]: K extends NonNullableFieldNames<T>
      ? T[K] extends Maybe<infer U> ? OptionalField<U> : RequiredField<T[K]>
      : OptionalField<NonNullable<T[K]>>
  }
>;

export const validateModel = mapValues(Field.validate);

export class Unvalidated<T> {
  readonly type: Type.Unvalidated = Type.Unvalidated;
  constructor(readonly model: FormModel<T>) {}
  static create<A>(model: FormModel<A>) {
    return new Unvalidated(model);
  }
}

export const isUnvalidated = <T = any>(form: Form<any>): form is Unvalidated<T> =>
  Validity.Type.Unvalidated === form.type;

export class Invalid<T> {
  readonly type: Type.Invalid = Type.Invalid;
  constructor(readonly model: FormModel<T>) {}
  static create<A>(model: FormModel<A>) {
    return new Invalid(model);
  }
}

export const isInvalid = <T = any>(form: Form<any>): form is Invalid<T> =>
  Validity.Type.Invalid === form.type;

export class Valid<T> {
  readonly type: Type.Valid = Type.Valid;
  constructor(readonly model: FormModel<T>) {}
  static create<A>(model: FormModel<A>) {
    return new Valid(model);
  }
}

export const isValid = <T = any>(form: Form<T>): form is Valid<T> =>
  Validity.Type.Valid === form.type;

export type Form<T> = Unvalidated<T> | Invalid<T> | Valid<T>;
export const Form = {
  Type,
  Unvalidated,
  Invalid,
  Valid,
  isUnvalidated,
  isInvalid,
  isValid
};

export default Form;

export class _Form<T> {
  constructor(readonly model: FormModel<T>, readonly validity: Validity = Validity.unvalidated()) {}

  static validate<T, F extends Form<T>>(form: F): F {
    return validateModel(form.model) as F;
  }

  static validateModel<T, FM extends FormModel<T>>(model: FM): FM {
    return validateModel(model) as FM;
  }

  get isValid(): boolean {
    return isValid(this);
  }

  validate(): Form<T> {
    return Form.validate<T, Form<T>>(this);
  }
}

export type FormProp<T> = keyof Form<T>['model'];
export type FormValue<T> = Form<T>['model'][FormProp<T>]['value'];

export type FromModel<T> = (
  model: T extends Maybe<infer U> ? Maybe<Partial<U>> : Partial<T>
) => Form<T extends Maybe<infer U> ? U : T>;
