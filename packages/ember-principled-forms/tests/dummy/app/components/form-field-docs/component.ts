import Component from '@ember/component';
import { tagName, layout } from '@ember-decorators/component';

import update from 'ember-object-update';
import { Maybe } from 'true-myth';

import Field, {
// @ts-ignore -- import to resolve name
  RequiredField,
  // @ts-ignore -- import to resolve name
  OptionalField,
  validate,
  Validate
} from '@olo/principled-forms/field';
import EmailField from '@olo/principled-forms/field/email';
import NumberField from '@olo/principled-forms/field/number';
import { FormProp, FormValue, FromModel } from '@olo/principled-forms/form';
import { minValue, minLength, maxLength } from '@olo/principled-forms/validators';

// @ts-ignore: Ignore import of compiled template
import template from './template';
import { action } from '@ember-decorators/object';

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

@tagName('')
@layout(template)
export default class FormField extends Component {
  user = userForm({
    age: 30,
    name: undefined,
    secondaryName: '',
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
