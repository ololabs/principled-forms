import Component from '@ember/component';
// @ts-ignore: Ignore import of compiled template
import layout from '../templates/components/principled-form-field';

export default class PrincipledFormField extends Component {
  layout = layout;

  // normal class body definition here
  name: string = this.name || 'principled-form-field';
};
