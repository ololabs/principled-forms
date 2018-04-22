import Component from "@ember/component";
import { assert } from "@ember/debug";
import { action } from "@ember-decorators/object";

import { defaultTo, noop, isString, isNil } from "lodash";
import { Field } from "principled-forms";
import { Type } from "principled-forms/field";

import { assertNever } from "ember-principled-forms/lib/type-utils";

// @ts-ignore: Ignore import of compiled template
import layout from "./template";

type StringInputType = Type.color | Type.email | Type.password | Type.text;

function parseValue(value: string, type: StringInputType): string;
function parseValue(value: string, type: Type.number): number;
function parseValue(value: string, type: Type.checkbox | Type.radio): boolean;
function parseValue(value: string, type: Type.date): Date;
function parseValue(
  value: string,
  type: Type
): string | number | boolean | Date {
  switch (type) {
    case Type.color:
    case Type.email:
    case Type.password:
    case Type.text:
      return value;

    case Type.checkbox:
    case Type.radio:
      return Boolean(value);

    case Type.date:
      return new Date(value);

    case Type.number:
      return Number(value);

    default:
      assertNever(type);
  }
}

export default class PrincipledFormField<T> extends Component {
  layout = layout;

  // normal class body definition here
  label: string;

  name: string = this.name || "principled-form-field";
  value?: T;
  type: Type = defaultTo(this.type, Type.text);

  // These take strings because we cannot rely on `valueAsNumber` etc. in IE11
  // or even Edge and so are left taking the event value as a string. The
  // owning form component is responsible to use the input type to do whatever
  // conversion is necessary before saving to either the form model or the
  // persistence model.
  onChange?: (newValue: T) => void = defaultTo(this.onChange, noop);
  onInput?: (newValue: T) => void = defaultTo(this.onInput, noop);

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
    this.onChange(parseValue(newValue, this.type as any) as any);
  }

  @action
  input(newValue: string): void {
    this.onInput(parseValue(newValue, this.type as any) as any);
  }
}
