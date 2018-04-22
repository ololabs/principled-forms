import Component from '@ember/component';
import { assert } from '@ember/debug';
import { action } from '@ember-decorators/object';

import { defaultTo, noop, isString, isNil } from 'lodash';
import Field, { InputTypes } from 'principled-forms/field';

// @ts-ignore: Ignore import of compiled template
import layout from './template';

export default class PrincipledFormField<T extends InputTypes> extends Component {
  layout = layout;

  // normal class body definition here
  label: string;
  value: T;

  onChange?: (value: T) => void = defaultTo(this.onChange, noop);
  onInput?: (value: T) => void = defaultTo(this.onInput, noop);

  name: string = this.name || 'principled-form-field';

  constructor() {
    super();

    assert('`label` is required', isString(this.label));
    assert('`value` is required', !isNil(this.value));
    assert(
      'at least one of `onChange`, `onInput` is required',
      this.onChange !== noop || this.onInput !== noop
    );
  }

  @action
  change(value: T): void {
    this.onChange(value);
  }

  @action
  input(value: T): void {
    this.onInput(value);
  }
}
