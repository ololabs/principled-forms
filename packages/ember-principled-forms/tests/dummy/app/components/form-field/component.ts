import Component from '@ember/component';
import { set } from '@ember/object';

import { action } from '@ember-decorators/object';
import update from 'ember-object-update';
import { Maybe } from 'true-myth';

import Field, { validate } from 'principled-forms/field';
import Number from 'principled-forms/field/number';
import Form, { FromModel } from 'principled-forms/form';

// @ts-ignore: Ignore import of compiled template
import layout from './template';

type User = {
  age: number;
  name: Maybe<string>;
};

const userForm: FromModel<User> = user => ({
  age: Number.required({ eager: false }),
  name: Field.optional()
});

type UserForm = Form<User>;
type FormProp = keyof UserForm;

export default class FormField extends Component {
  layout = layout;

  user: UserForm = userForm({ age: 30, name: Maybe.just('Chris') });

  age = null;
  name = null;

  foo = this.user.name.value;

  @action
  handleChange(property: FormProp, value: UserForm[FormProp]['value']) {
    update(this.user, property, (field: Field<any>) => validate({ ...field, value }));
  }

  @action
  handleInput(property: FormProp, value: string) {
    update(this.user, property, (field: Field<any>) => validate({ ...field, value }));
  }
}
