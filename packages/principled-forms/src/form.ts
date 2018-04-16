import { Maybe } from 'true-myth';
import { identity, negate } from 'lodash';

type Unmaybe<T> = T extends Maybe<infer U> ? U : T;

type Form<Model> = { [K in keyof Model]: Field<Unmaybe<Model[K]>> };

type Address = {
  street: string;
  building: Maybe<string>;
  city: string;
  zipCode: string;
};

type AddressForm = Form<Address>;

const isValidField = <T>(field: Field<T>): boolean =>
  field.validators
    .map(validate => validate(field.value))
    .every(validity => validity.type === ValidityType.Valid);

const isInvalid = (v: Validity): v is Invalid =>
  v.type === ValidityType.Invalid;

const isValidForm = <T>(form: Form<T>): boolean =>
  (Object.keys(form) as Array<keyof Form<T>>)
    .map(key => form[key])
    .map(isValidField)
    .every(identity);

const addressForm: Form<Address> = {
  street: {
    type: 'text',
    value: undefined,
    validity: UNVALIDATED,
    validators: [required]
  },
  building: {
    type: 'text',
    value: undefined,
    validity: UNVALIDATED,
    validators: [minLength(1)].map(optional)
  },
  city: {
    type: 'text',
    value: undefined,
    validity: UNVALIDATED,
    validators: [required, minLength(1)]
  },
  zipCode: {
    type: 'text',
    value: undefined,
    validity: UNVALIDATED,
    validators: [required, regex(ZIP_CODE_RE, 'not a valid zip code')]
  }
};

const result = isValidForm(addressForm);
