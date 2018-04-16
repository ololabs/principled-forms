import Validity, {
  Validate,
  Rule,
  optional,
  Validator,
  required,
  Validated,
} from './validity';
import { regex, minLength, maxLength, minValue, maxValue } from './validators';

export enum Required {
  Yes,
  No,
}

export enum Type {
  Email = 'email',
  Text = 'text',
  Number = 'number',
}

export interface MinimalField<T> {
  value?: T;
  readonly type: Type;
  readonly required: boolean;
  readonly validators: Validator<T>[];
  readonly validity: Validity;
}

const validate = <T>(field: MinimalField<T>): Validated[] => {
  const rule = field.required ? required : optional;
  return rule(...field.validators)(field.value);
};

export class Input<T> implements MinimalField<T> {
  value?: T;
  required: boolean;

  get validity(): Validity {
    return validate(this)[0];
  }

  static withValue<T>(
    value: T,
    type: Type,
    validators: Validator<T>[],
    required = Required.No
  ): Input<T> {
    const instance = new Input(type, validators, required);
    instance.value = value;
    return instance;
  }

  static empty<T>(
    type: Type,
    validators: Validator<T>[],
    required = Required.No
  ): Input<T> {
    return new Input(type, validators, required);
  }

  constructor(
    readonly type: Type,
    readonly validators: Validator<T>[],
    required = Required.No
  ) {
    this.required = required === Required.Yes;
  }
}

export class Select<T> implements MinimalField<T> {
  value?: T;
  required: boolean;

  get validity(): Validity {
    return validate(this)[0];
  }

  constructor(
    readonly type: Type,
    readonly validators: Validator<T>[],
    required = Required.No
  ) {
    this.type = type;
    this.required = required === Required.Yes;
  }
}

const EMAIL_RE = /.+@.+\..+/;
const emailValidator = regex(
  EMAIL_RE,
  (val: string) => `${val} is not a valid email address`
);

export class Email extends Input<string> {
  constructor(validators: Validator<string>[] = [], required = Required.No) {
    super(Type.Email, [emailValidator].concat(validators), required);
  }
}

export type Field<T> = Input<T> | Select<T> | Email;
