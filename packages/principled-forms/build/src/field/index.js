import { Just, Nothing } from 'true-myth/maybe';
import Validity from '../validity';
export var Type;
(function (Type) {
    Type["email"] = "email";
    Type["text"] = "text";
    Type["number"] = "number";
    Type["color"] = "color";
    Type["date"] = "date";
    Type["password"] = "password";
    Type["checkbox"] = "checkbox";
    Type["radio"] = "radio";
})(Type || (Type = {}));
const isMaybe = (v) => v instanceof Just || v instanceof Nothing;
const _validate = (field) => {
    const rule = field.isRequired ? Validity.required : Validity.optional;
    return rule(...field.validators)(field.value);
};
export var Laziness;
(function (Laziness) {
    Laziness[Laziness["Lazy"] = 0] = "Lazy";
    Laziness[Laziness["Eager"] = 1] = "Eager";
})(Laziness || (Laziness = {}));
export function validate(field) {
    const validities = _validate(field);
    // We eagerly validate *either* when configured to *or* when the field has
    // already been validated, since in that case any change to invalidity should
    // immediately be flagged to the user.
    const eagerlyValidate = field.eager || Validity.isValidated(field.validity);
    const onInvalid = (reason) => eagerlyValidate ? Validity.Invalid.because(reason) : Validity.unvalidated();
    const newValidity = validities.every(Validity.isValid)
        ? Validity.valid()
        : onInvalid(validities.find(Validity.isInvalid).reason); // at least one by definition
    return Object.assign({}, field, { validity: newValidity });
}
export class RequiredField {
    constructor({ type = Type.text, validity = Validity.unvalidated(), validators = [], value = undefined, eager = true, } = {}) {
        this.isRequired = true;
        this.type = type;
        this.value = value;
        this.eager = eager;
        this.validity = validity;
        this.validators = validators;
    }
}
const required = (config) => new RequiredField(config);
export class OptionalField {
    constructor({ type = Type.text, validity = Validity.unvalidated(), validators = [], value = undefined, eager = true, } = {}) {
        this.isRequired = false;
        if (isMaybe(value)) {
            this.value = value.isJust() ? value.unsafelyUnwrap() : undefined;
        }
        else {
            this.value = value;
        }
        this.type = type;
        this.eager = eager;
        this.validity = validity;
        this.validators = validators;
    }
}
const optional = (config) => new OptionalField(config);
export const Field = {
    Required: RequiredField,
    Optional: OptionalField,
    required,
    optional,
    validate,
};
export default Field;
