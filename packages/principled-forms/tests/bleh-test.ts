import { Maybe } from 'true-myth';
import { isValid, FromModel } from 'src/form';
import { InputField, Type } from 'src/field';
import { minLength, maxLength } from 'src/validators';

type User = {
  firstName: string;
  middleName: Maybe<string>;
  lastName: string;
};

const nameValidations = [minLength(1), maxLength(40)];

const fromUser: FromModel<User> = user => ({
  firstName: InputField.required(Type.text, nameValidations, user.firstName),
  middleName: InputField.optional(
    Type.text,
    nameValidations,
    user.middleName.unwrapOr(undefined as any)
  ),
  lastName: InputField.required(Type.text, nameValidations, user.lastName),
});

const fromMaybeUser: FromModel<Maybe<User>> = Maybe.match({
  Just: fromUser,
  Nothing: () => ({
    firstName: InputField.required(Type.text, nameValidations),
    middleName: InputField.optional(Type.text, nameValidations),
    lastName: InputField.required(Type.text, nameValidations),
  }),
});

const frank: User = {
  firstName: 'Frank',
  middleName: Maybe.nothing(),
  lastName: 'Tan',
};

const form = fromUser(frank);
const valid = isValid(form);
