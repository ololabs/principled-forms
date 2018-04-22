import { Validator } from './validity';
export declare const minLength: (min: number, err?: ((val: number) => string) | undefined) => Validator<string>;
export declare const maxLength: (max: number, err?: ((val: number) => string) | undefined) => Validator<string>;
export declare const minValue: (min: number, err?: ((val: number) => string) | undefined) => Validator<number>;
export declare const maxValue: (max: number, err?: ((val: number) => string) | undefined) => Validator<number>;
export declare const regex: (re: RegExp, err: (val: string) => string) => Validator<string>;
