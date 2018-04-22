import Component from "@ember/component";
import { assert } from "@ember/debug";
import { action } from "@ember-decorators/object";

import { defaultTo, noop, isString, isNil } from "lodash";
import Field from "principled-forms/field";

// @ts-ignore: Ignore import of compiled template
import layout from "./template";

export default class PrincipledFormField<T> extends Component {
  layout = layout;

  // normal class body definition here
  label: string;

  name: string = this.name || "principled-form-field";
  value?: T;
  type = defaultTo(this.type, "text");

  // These take strings because we cannot rely on `valueAsNumber` etc. in IE11
  // or even Edge and so are left taking the event value as a string. The
  // owning form component is responsible to use the input type to do whatever
  // conversion is necessary before saving to either the form model or the
  // persistence model.
  onChange?: (newValue: string) => void = defaultTo(this.onChange, noop);
  onInput?: (newValue: string) => void = defaultTo(this.onInput, noop);

  constructor() {
    super();

    assert("`label` is required", isString(this.label));
    assert(
      "at least one of `onChange`, `onInput` is required",
      this.onChange !== noop || this.onInput !== noop
    );
  }

  @action
  change(newValue: string): void {
    this.onChange(newValue);
  }

  @action
  input(newValue: string): void {
    this.onInput(newValue);
  }
}
