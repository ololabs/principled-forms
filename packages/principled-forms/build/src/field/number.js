import Field, { Type } from '.';
import Validity from '../validity';
export const Number = {
    required({ validators = [], value = undefined, validity = Validity.unvalidated(), eager = false, } = {}) {
        return Field.required({ type: Type.number, validators, value, validity, eager });
    },
    optional({ validators = [], value = undefined, validity = Validity.unvalidated(), eager = false, } = {}) {
        return Field.optional({ type: Type.number, validators, value, validity, eager });
    },
};
export default Number;
