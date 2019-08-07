import Component from '@ember/component';
import { assert } from '@ember/debug';
import { computed } from '@ember/object';
import { tagName, layout } from '@ember-decorators/component';
import { isNone } from '@ember/utils';

import Field, { Type } from '@olo/principled-forms/field';
import { isInvalid, Invalid } from '@olo/principled-forms/validity';

import { assertNever } from '../../lib/type-utils';

// @ts-ignore: Ignore import of compiled template
import template from './template';

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
@tagName('')
@layout(template)
export default class FormField<T> extends Component {
  id!: string;
  errorId!: string;
  onChange!: (newValue: T) => void;
  onInput!: (newValue: T) => void;
  
  readonly label!: string;
  readonly model!: Field<T>;

  @computed('model.validity')
  get isInvalid() {
    return isInvalid(this.model.validity);
  }

  @computed('isInvalid', 'model.validity.reason')
  get error() {
    return this.isInvalid ? (this.model.validity as Invalid).reason : '';
  }

  @computed('model.isRequired')
  get required(): HTMLAttribute {
    return this.model.isRequired ? true : undefined;
  }

  @computed('isInvalid')
  get ariaInvalid(): HTMLAttribute {
    return !this.isInvalid ? undefined : 'true';
  }

  @computed('isInvalid')
  get ariaDescribedBy(): HTMLAttribute {
    return this.isInvalid ? this.errorId : undefined;
  }

  init() {
    super.init();

    // DISCUSS: What other useful defaults can we apply?
    // e.g. an ARIA object
    this.id = defaultTo(this.id, `form-field-${this.model.type}-${this.label}`);
    this.errorId = defaultTo(this.errorId, `${this.id}-error`);
    this.onChange = defaultTo(this.onChange, noop);
    this.onInput = defaultTo(this.onInput, noop);

    assert(`\`model\` is required on '${this.id}'`, !isNone(this.model));
    assert(`\`label\` is required on '${this.id}'`, isString(this.label));
    assert(
      `at least one of \`onChange\` or \`onInput\` is required '${this.id}'`,
      this.onChange !== noop || this.onInput !== noop
    );
  }

  // Both of these have double `as any` coercions because Typescript currently
  // fails to properly resolve the generic with the type narrowing.
  handleChange(newValue: string): void {
    this.onChange(parseValue(newValue, this.model.type as any) as any);
  }

  handleInput(newValue: string): void {
    this.onInput(parseValue(newValue, this.model.type as any) as any);
  }
}
