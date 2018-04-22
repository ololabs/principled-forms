import { isVoid } from 'true-myth/utils';
export var Type;
(function (Type) {
    Type[Type["Unvalidated"] = 0] = "Unvalidated";
    Type[Type["Invalid"] = 1] = "Invalid";
    Type[Type["Valid"] = 2] = "Valid";
})(Type || (Type = {}));
let UNVALIDATED;
export class Unvalidated {
    constructor() {
        this.type = Type.Unvalidated;
    }
    static create() {
        if (isVoid(UNVALIDATED)) {
            UNVALIDATED = new Unvalidated();
        }
        return UNVALIDATED;
    }
}
export const unvalidated = Unvalidated.create;
export const isUnvalidated = (v) => v.type === Type.Unvalidated;
export class Invalid {
    constructor(reason) {
        this.reason = reason;
        this.type = Type.Invalid;
    }
    static because(reason) {
        return new Invalid(reason);
    }
}
export const invalid = Invalid.because;
export const isInvalid = (v) => v.type === Type.Invalid;
let VALID;
export class Valid {
    constructor() {
        this.type = Type.Valid;
    }
    static create() {
        if (isVoid(VALID)) {
            VALID = new Valid();
        }
        return VALID;
    }
}
export const valid = Valid.create;
export const isValid = (v) => v.type === Type.Valid;
export const isValidated = (v) => !isUnvalidated(v);
export const required = (...validators) => (value) => isVoid(value) || (typeof value === 'string' && value.trim() === '')
    ? [Invalid.because('field is required')]
    : validators.map(validate => validate(value));
export const optional = (...validators) => (value) => isVoid(value) ? [valid()] : validators.map(validate => validate(value));
export const Validity = {
    Type,
    Unvalidated,
    unvalidated,
    isUnvalidated,
    isValidated,
    Invalid,
    invalid,
    isInvalid,
    Valid,
    valid,
    isValid,
    required,
    optional,
};
export default Validity;
