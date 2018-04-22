import Controller from '@ember/controller';
import { action } from '@ember-decorators/object';

import { Maybe } from 'true-myth';

import Form, { FromModel } from 'principled-forms/form';
import { minValue } from 'principled-forms/validators';
import Field from 'principled-forms/field';
import Number from 'principled-forms/field/number';

type User = {
  age: number;
  name: Maybe<string>;
};

const userForm: FromModel<User> = user => ({
  age: Number.required({ validators: [minValue(0)] }),
  name: Field.optional(),
});

export default class Application extends Controller {
  user: Form<User> = userForm({ age: 30, name: Maybe.just('Chris') });

  @action
  change(value: string) {}

  @action
  input(value: string) {}

  constructor() {
    super();
    debugger; // eslint-disable-line no-debugger
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    application: Application;
  }
}
