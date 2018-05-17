import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

import Form from '@olo/principled-forms/form';
import { Field } from '@olo/principled-forms/field';

export type User = {
  name?: string;
  age: number;
};

module('Integration | Component | form-field', function(hooks) {
  setupRenderingTest(hooks);

  test('it renders', async function(assert) {
    const name = Field.optional<string>();
    const age = Field.required({ value: 12 });

    const model: Form<User> = { name, age };
    const noop = () => {};

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.set('myAction', function(val) { ... });
    this.setProperties({ model, onInput: noop, onChange: noop });

    await render(hbs`{{form-field label='Name' model=this.model.name onInput=this.onInput}}`);
    assert.ok(
      (this.element.querySelector('input') as HTMLInputElement).value === '',
      'optional field value renders'
    );

    await render(hbs`{{form-field label='Name' model=this.model.age onInput=this.onInput}}`);
    assert.ok(
      (this.element.querySelector('input') as HTMLInputElement).value === age.value!.toString(),
      'required field value renders'
    );

    // Template block usage:
    const label = 'wat';
    this.set('label', label);
    await render(hbs`
      {{#form-field label=this.label model=model.name onChange=this.onChange as |field|}}
        {{field.label}}
      {{/form-field}}
    `);

    assert.equal(this.element.textContent!.trim(), label, 'yields field model back out');
  });
});
