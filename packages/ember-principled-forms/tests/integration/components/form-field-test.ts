import { module, test } from 'qunit';
import { setupRenderingTest } from 'ember-qunit';
import { render } from '@ember/test-helpers';
import hbs from 'htmlbars-inline-precompile';

import a11yAudit from 'ember-a11y-testing/test-support/audit';

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
    const optionalInput = (this.element.querySelector('input') as HTMLInputElement);
    const optionalInputLabel = (this.element.querySelector('label') as HTMLLabelElement);
    assert.ok(
      optionalInput.value === '',
      'optional field value renders'
    );
    assert.equal(optionalInputLabel.htmlFor, optionalInput.id, 'label is connected to input');
    assert.notOk(optionalInput.hasAttribute('required'), 'optional input does not have required attr');
    assert.notOk(optionalInput.hasAttribute('aria-invalid'), 'valid input has no invalid state');
    assert.notOk(optionalInput.hasAttribute('aria-describedby'), 'valid input has not described-by');

    await a11yAudit();

    await render(hbs`{{form-field label='Age' model=this.model.age onInput=this.onInput}}`);
    const requiredInput = (this.element.querySelector('input') as HTMLInputElement);
    assert.ok(
      requiredInput.value === age.value!.toString(),
      'required field value renders'
    );
    assert.ok(requiredInput.hasAttribute('required'), 'required field is set to true')

    await a11yAudit();

    // Template block usage:
    const label = 'wat';
    this.set('label', label);
    await render(hbs`
      {{#form-field label=this.label model=model.name onChange=this.onChange as |field|}}
        {{field.label}}
      {{/form-field}}
    `);

    assert.equal(this.element.textContent!.trim(), label, 'yields field model back out');

    await a11yAudit();
  });

  test('error state is correct', async function(assert) {
    const name = Field.validate(Field.required<string>());

    const noop = () => {};
    this.setProperties({ name, onInput: noop, onChange: noop });

    await render(hbs`{{form-field label='Name' model=this.name onInput=this.onInput}}`);
    const nameInput = (this.element.querySelector('input') as HTMLInputElement);
    const errorSpan = (this.element.querySelector('span') as HTMLElement);

    assert.ok(errorSpan, 'error exists');
    assert.ok(nameInput.getAttribute('aria-invalid'), 'invalid input has aria-invalid true');
    assert.equal(nameInput.getAttribute('aria-describedby'), errorSpan.id, 'valid input has error id described-by');
    assert.equal(errorSpan.textContent!.trim(), 'field is required', 'displays required error');

    await a11yAudit();

    // Block Format
    await render(hbs`
      {{#form-field label='Name' model=this.name onInput=this.onInput as |field|}}
        <input
          id={{field.id}}
          value={{field.model.value}}
          aria-invalid={{field.ariaInvalid}}
          aria-describedby={{field.ariaDescribedBy}}
        />

        {{#if field.isInvalid}}
          <span class={{errorClass}} id={{field.errorId}}>{{field.model.validity.reason}}</span>
        {{/if}}
      {{/form-field}}
    `);

    const blockNameInput = (this.element.querySelector('input') as HTMLInputElement);
    const blockErrorSpan = (this.element.querySelector('span') as HTMLElement);
    assert.ok(blockNameInput.getAttribute('aria-invalid'), 'block | invalid input has aria-invalid true');
    assert.equal(blockNameInput.getAttribute('aria-describedby'), blockErrorSpan.id, 'block | valid input has error id described-by');
    assert.equal(blockErrorSpan.textContent!.trim(), 'field is required', 'block | displays required error');
  });
});
