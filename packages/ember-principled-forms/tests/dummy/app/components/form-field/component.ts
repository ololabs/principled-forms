import Component from '@ember/component';
import { set } from '@ember/object';

import { action } from '@ember-decorators/object';
import update from 'ember-object-update';
import { Maybe } from 'true-myth';

import Field, { validate } from 'principled-forms/field';
import EmailField from 'principled-forms/field/email';
import NumberField from 'principled-forms/field/number';
import Form, { FromModel } from 'principled-forms/form';
import { minValue } from 'principled-forms/validators';
import Validity from 'principled-forms/validity';

// @ts-ignore: Ignore import of compiled template
import layout from './template';

type User = {
  age: number;
  name: string;
  emailOpt: Maybe<string>;
  emailReq: string;
};

const userForm: FromModel<User> = user => ({
  // DISCUSS: Does it actually every make sense for `eager` to be false?
  // Isn't our need for eagerness solved by having a separate unvalidated state?
  age: NumberField.required({ value: user.age, validators: [minValue(18)] }),
  name: Field.required({ value: user.name }),
  emailOpt: EmailField.optional({ value: user.emailOpt }), 
  emailReq: EmailField.required({ value: user.emailReq }),
});

type UserForm = Form<User>;
type FormProp = keyof UserForm;
// DISCUSS: This should probably be its own type for convenience, e.g. FormValue<T>
type FormValue = UserForm[FormProp]['value'];

export default class FormField extends Component {
  layout = layout;

  user: UserForm = userForm({ age: 30, name: 'Chris', emailOpt: Maybe.nothing(), emailReq: undefined });

  // DISCUSS: Should we supply a `FormBase` component that supplies these actions?
  @action
  handleChange(property: FormProp, value: FormValue) {
    update(this.user, property, (field) => validate({ ...field, value }, true) as any);
  }

  @action
  handleInput(property: FormProp, value: FormValue) {
    update(this.user, property, (field) => validate({ ...field, value }) as any);
  }
}
