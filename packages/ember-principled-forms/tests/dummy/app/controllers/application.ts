import Controller from "@ember/controller";
import { set } from "@ember/object";
import { action } from "@ember-decorators/object";

import update from "ember-object-update";
import { Maybe } from "true-myth";

import Form, { FromModel } from "principled-forms/form";
import Field, { validate } from "principled-forms/field";
import Number from "principled-forms/field/number";
import { minValue } from "principled-forms/validators";

type User = {
  age: number;
  name: Maybe<string>;
};

const userForm: FromModel<User> = user => ({
  age: Number.required(),
  name: Field.optional(),
});

type UserForm = Form<User>;
type FormProp = keyof UserForm;

export default class Application extends Controller {
  user: UserForm = userForm({ age: 30, name: Maybe.just("Chris") });

  @action
  change(property: FormProp, value: UserForm[FormProp]["value"]) {
    update(this.user, property, (field: Field<any>) =>
      validate({ ...field, value })
    );
  }

  @action
  input(property: FormProp, value: string) {
    update(this.user, property, (field: Field<any>) =>
      validate({ ...field, value })
    );
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module "@ember/controller" {
  interface Registry {
    application: Application;
  }
}
