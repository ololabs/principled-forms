import Maybe, { Just, Nothing } from 'true-myth/maybe';
import Validity, { Validator } from '../validity';
export declare enum Type {
    email = "email",
    text = "text",
    number = "number",
    color = "color",
    date = "date",
    password = "password",
    checkbox = "checkbox",
    radio = "radio",
}
export declare enum Laziness {
    Lazy = 0,
    Eager = 1,
}
export declare function validate<T>(field: Field<T>): Field<T>;
export interface MinimalField<T> {
    value?: T;
    isRequired: boolean;
    readonly type: Type;
    readonly validators: Validator<T>[];
    readonly validity: Validity;
}
export declare type RequiredFieldConfig<T> = Partial<{
    type: Type;
    eager: boolean;
    validity: Validity;
    validators: Array<Validator<T>>;
    value: T;
}>;
export declare class RequiredField<T> implements MinimalField<T> {
    value?: T;
    eager: boolean;
    isRequired: true;
    readonly type: Type;
    readonly validators: Array<Validator<T>>;
    readonly validity: Validity;
    constructor({type, validity, validators, value, eager}?: RequiredFieldConfig<T>);
}
export declare type OptionalFieldConfig<T> = Partial<{
    type: Type;
    eager: boolean;
    validity: Validity;
    validators: Array<Validator<T>>;
    value: T | Maybe<T>;
}>;
export declare class OptionalField<T> implements MinimalField<T> {
    value?: T;
    eager: boolean;
    isRequired: false;
    readonly type: Type;
    readonly validators: Array<Validator<T>>;
    readonly validity: Validity;
    constructor({type, validity, validators, value, eager}?: OptionalFieldConfig<T>);
}
export declare type Field<T> = RequiredField<T> | OptionalField<T>;
export interface FieldConstructors<T> {
    required(options: RequiredFieldConfig<T>): RequiredField<T>;
    optional(options: OptionalFieldConfig<T>): OptionalField<T>;
}
export declare const Field: {
    Required: typeof RequiredField;
    Optional: typeof OptionalField;
    required: <T>(config?: Partial<{
        type: Type;
        eager: boolean;
        validity: Validity;
        validators: Validator<T>[];
        value: T;
    }> | undefined) => RequiredField<T>;
    optional: <T>(config?: Partial<{
        type: Type;
        eager: boolean;
        validity: Validity;
        validators: Validator<T>[];
        value: T | Just<T> | Nothing<T>;
    }> | undefined) => OptionalField<T>;
    validate: typeof validate;
};
export default Field;
