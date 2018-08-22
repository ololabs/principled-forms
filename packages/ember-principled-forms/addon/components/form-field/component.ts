import Component from '@ember/component';
import { assert } from '@ember/debug';
import { action, computed } from '@ember-decorators/object';

import Field, { Type } from '@olo/principled-forms/field';
import { isInvalid } from '@olo/principled-forms/validity';

import { assertNever } from '@olo/ember-principled-forms/lib/type-utils';

// @ts-ignore: Ignore import of compiled template
import layout from './template';
import { isNone } from '@ember/utils';

type StringInputType = Type.color | Type.email | Type.password | Type.text;

export type HTMLAttribute = string | undefined | boolean | number;

const noop = (..._args: any[]) => {};

// From _.isString, simplified very slightly.
function isString(value: any): value is string {
  const type = typeof value;
  return type == 'string' || (type == 'object' && value != null && !Array.isArray(value));
}

function defaultTo<T>(value: T | null | undefined, defaultValue: T): T {
  return isNone(value) ? defaultValue : value;
}

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
      return assertNever(type);
  }
}

/**
  A form field component.

  @class FormField
  @export default
 */
export default class FormField<T> extends Component {
  layout = layout;

  label!: string;
  readonly model!: Field<T>;

  @computed('model.validity')
  get isInvalid() {
    return isInvalid(this.model.validity);
  }

  @computed('model.isRequired')
  get required(): HTMLAttribute {
    return this.model.isRequired ? true : undefined;
  }

  @computed('isInvalid')
  get ariaInvalid(): HTMLAttribute {
    const isValid = !this.isInvalid;
    return isValid ? undefined : 'true';
  }

  // DISCUSS: What other useful defaults can we apply?
  // e.g. an ARIA object
  id: string = defaultTo(this.id, `form-field-${this.model.type}-${this.label}`);
  errorId: string = defaultTo(
    `${this.id}-error`,
    `form-field-${this.model.type}-${this.label}-error`
  );

  @computed('isInvalid')
  get ariaDescribedBy(): HTMLAttribute {
    return this.isInvalid ? this.errorId : undefined;
  }

  onChange: (newValue: T) => void = defaultTo(this.onChange, noop);
  onInput: (newValue: T) => void = defaultTo(this.onInput, noop);

  constructor() {
    super(...arguments);

    assert(`\`model\` is required on '${this.id}'`, !isNone(this.model));
    assert(`\`label\` is required on '${this.id}'`, isString(this.label));
    assert(
      `at least one of \`onChange\` or \`onInput\` is required '${this.id}'`,
      this.onChange !== noop || this.onInput !== noop
    );
  }

  // Both of these have double `as any` coercions because Typescript currently
  // fails to properly resolve the generic with the type narrowing.

  @action
  handleChange(newValue: string): void {
    this.onChange(parseValue(newValue, this.model.type as any) as any);
  }

  @action
  handleInput(newValue: string): void {
    this.onInput(parseValue(newValue, this.model.type as any) as any);
  }
}
