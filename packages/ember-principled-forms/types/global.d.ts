// Types for compiled templates
declare module '@olo/ember-principled-forms/templates/*' { 
  import { TemplateFactory } from 'htmlbars-inline-precompile';
  const tmpl: TemplateFactory;
  export default tmpl;
}
