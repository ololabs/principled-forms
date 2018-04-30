import Component from '@ember/component';
import { assert } from '@ember/debug';
import { action } from '@ember-decorators/object';

// DISCUSS: Do we really need a lodash dependency?
// DISCUSS: I also wonder if there is a way to design these packages without requiring true-myth
import { defaultTo, noop, isString, isNil } from 'lodash';
import Field, { Type } from 'principled-forms/field';

import { assertNever } from 'ember-principled-forms/lib/type-utils';

// @ts-ignore: Ignore import of compiled template
import layout from './template';

type StringInputType = Type.color | Type.email | Type.password | Type.text;

function parseValue(value: string, type: StringInputType): string;
function parseValue(value: string, type: Type.number): number;
function parseValue(value: string, type: Type.checkbox | Type.radio): boolean;
function parseValue(value: string, type: Type.date): Date;
function parseValue(value: string, type: Type): string | number | boolean | Date {
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

/**
  A form field component.

  @class PrincipledFormField
  @export default
 */
export default class PrincipledFormField<T> extends Component {
  layout = layout;

  label: string;

  // DISCUSS: What other useful defaults can we apply?
  // e.g. an ARIA object
  type: Type = defaultTo(this.type, Type.text);
  id: string = defaultTo(this.id, `principled-form-field-${this.type}-${this.label}`);

  // These take strings because we cannot rely on `valueAsNumber` etc. in IE11
  // or even Edge and so are left taking the event value as a string. The
  // owning form component is responsible to use the input type to do whatever
  // conversion is necessary before saving to either the form model or the
  // persistence model.
  onChange?: (newValue: T) => void = defaultTo(this.onChange, noop);
  onInput?: (newValue: T) => void = defaultTo(this.onInput, noop);

  constructor() {
    super(...arguments);

    assert(`\`label\` is required on '${this.id}'`, isString(this.label));
    assert(
      `at least one of \`onChange\` or \`onInput\` is required '${this.id}'`,
      this.onChange !== noop || this.onInput !== noop
    );
  }

  @action
  handleChange(newValue: string): void {
    this.onChange(parseValue(newValue, this.type as any) as any);
  }

  @action
  handleInput(newValue: string): void {
    this.onInput(parseValue(newValue, this.type as any) as any);
  }
}
