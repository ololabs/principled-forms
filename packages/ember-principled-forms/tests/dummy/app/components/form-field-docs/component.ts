import Component from '@ember/component';

import { action } from '@ember-decorators/object';
import update from 'ember-object-update';
import { Maybe } from 'true-myth';

import Field, {
// @ts-ignore -- import to resolve name
  RequiredField,
  // @ts-ignore -- import to resolve name
  OptionalField,
  validate,
  Validate
} from 'principled-forms/field';
import EmailField from 'principled-forms/field/email';
import NumberField from 'principled-forms/field/number';
import { FormProp, FormValue, FromModel } from 'principled-forms/form';
import { minValue, minLength, maxLength } from 'principled-forms/validators';

// @ts-ignore: Ignore import of compiled template
import layout from './template';

export type User = {
  age: number;
  name: string;
  secondaryName?: string;
  emailOpt: Maybe<string>;
  emailReq: string;
};

const nameValidators = [minLength(4), maxLength(40)];

const userForm: FromModel<User> = user => ({
  age: NumberField.required({ value: user.age, validators: [minValue(18)] }),
  name: Field.required({ value: user.name, validators: nameValidators }),
  secondaryName: Field.optional({ value: user.secondaryName, validators: nameValidators }),
  emailOpt: EmailField.optional({ value: user.emailOpt }),
  emailReq: EmailField.required({ value: user.emailReq })
});

export default class FormField extends Component {
  layout = layout;

  user = userForm({
    age: 30,
    name: undefined,
    secondaryName: 'Skywalker',
    emailOpt: Maybe.nothing(),
    emailReq: undefined
  });

  // DISCUSS: Should we supply a `FormBase` component that supplies these actions?
  @action
  handleChange(property: FormProp<User>, value: FormValue<User>) {
    update(this.user, property, field => validate({ ...field, value }, Validate.Eagerly) as any);
  }

  @action
  handleInput(property: FormProp<User>, value: FormValue<User>) {
    update(this.user, property, field => validate({ ...field, value }, Validate.Lazily) as any);
  }
}
