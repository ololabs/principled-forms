export declare enum Type {
    Unvalidated = 0,
    Invalid = 1,
    Valid = 2,
}
export declare class Unvalidated {
    type: Type.Unvalidated;
    constructor();
    static create(): Unvalidated;
}
export declare const unvalidated: typeof Unvalidated.create;
export declare const isUnvalidated: (v: Validity) => v is Unvalidated;
export declare class Invalid {
    readonly reason: string;
    type: Type.Invalid;
    constructor(reason: string);
    static because(reason: string): Invalid;
}
export declare const invalid: typeof Invalid.because;
export declare const isInvalid: (v: Validity) => v is Invalid;
export declare class Valid {
    type: Type.Valid;
    constructor();
    static create(): Valid;
}
export declare const valid: typeof Valid.create;
export declare const isValid: (v: Validity) => v is Valid;
export declare type Validated = Invalid | Valid;
export declare const isValidated: (v: Validity) => v is Validated;
export declare type Validator<T> = (value: T) => Validated;
export declare type RequiredRule = <T>(...validators: Validator<T>[]) => (value?: T | null) => Validated[];
export declare type LazinessRule = <T>(validator: Validator<T>) => Validator<T>;
export declare const required: RequiredRule;
export declare const optional: RequiredRule;
export declare type Validity = Unvalidated | Validated;
export declare const Validity: {
    Type: typeof Type;
    Unvalidated: typeof Unvalidated;
    unvalidated: typeof Unvalidated.create;
    isUnvalidated: (v: Validity) => v is Unvalidated;
    isValidated: (v: Validity) => v is Validated;
    Invalid: typeof Invalid;
    invalid: typeof Invalid.because;
    isInvalid: (v: Validity) => v is Invalid;
    Valid: typeof Valid;
    valid: typeof Valid.create;
    isValid: (v: Validity) => v is Valid;
    required: RequiredRule;
    optional: RequiredRule;
};
export default Validity;
