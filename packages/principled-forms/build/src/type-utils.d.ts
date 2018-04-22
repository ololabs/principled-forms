export declare type NonNullableFieldNames<T> = {
    [K in keyof T]: T[K] extends NonNullable<T[K]> ? K : never;
}[keyof T];
export declare type NullableFieldNames<T> = Exclude<keyof T, NonNullableFieldNames<T>>;
export declare type NonNullableFields<T> = Pick<T, NonNullableFieldNames<T>>;
export declare type NullableFields<T> = Pick<T, Exclude<keyof T, NonNullableFieldNames<T>>>;
