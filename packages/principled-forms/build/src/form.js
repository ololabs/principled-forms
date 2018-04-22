import Field from './field';
import Validity from './validity';
export const isValid = (form) => Object.keys(form)
    .map(key => form[key]) // `any` b/c TS loses mapped type context here
    .map(Field.validate)
    .map(field => field.validity)
    .map(Validity.isValid)
    .reduce((allValid, validity) => allValid && validity, true); // flatMap
export const Form = {
    isValid,
};
export default Form;
