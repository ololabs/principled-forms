export type NonNullableFieldNames<T> = {
  [K in keyof T]: T[K] extends NonNullable<T[K]> ? K : never
}[keyof T];

export type NonNullableFields<T> = Pick<T, NonNullableFieldNames<T>>;

export type NullableFields<T> = Pick<T, Exclude<keyof T, NonNullableFieldNames<T>>>;
