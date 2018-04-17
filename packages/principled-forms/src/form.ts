import { Maybe } from 'true-myth';
import { every } from 'lodash/fp';

import Field, { OptionalField, RequiredField } from './field';
import Validity from './validity';

export type Form<Model> = {
  [K in keyof Model]: Model[K] extends Maybe<infer U> ? OptionalField<U> : RequiredField<Model[K]>
};

export const isValid = <T, K extends keyof Form<T>>(form: Form<T>): boolean =>
  (Object.keys(form) as K[])
    .map(key => form[key] as Field<T[K]>)
    .map(Field.validate)
    .map(every(Validity.isValid))
    .reduce((allValid, validity) => allValid && validity, true); // flatMap

export type FromModel<T> = (
  model: T extends Maybe<infer U> ? Maybe<U> : T
) => Form<T extends Maybe<infer U> ? U : T>;

export const Form = {
  isValid,
};
