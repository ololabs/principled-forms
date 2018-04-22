import Component from '@ember/component';
// @ts-ignore: Ignore import of compiled template
import layout from './template';

export default class PrincipledFormField extends Component {
  layout = layout;

  // normal class body definition here
  name: string = this.name || 'principled-form-field';
};
