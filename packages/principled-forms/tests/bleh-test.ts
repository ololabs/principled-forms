import { Maybe } from 'true-myth';
import { isValid, FromModel } from 'src/form';
import { Type, RequiredField, OptionalField } from 'src/field';
import { minLength, maxLength } from 'src/validators';

type User = {
  firstName: string;
  middleName: Maybe<string>;
  lastName: string;
};

const nameValidations = [minLength(1), maxLength(40)];

const fromUser: FromModel<User> = user => ({
  firstName: new RequiredField(Type.text, nameValidations, user.firstName),
  middleName: new OptionalField(
    Type.text,
    nameValidations,
    user.middleName.unwrapOr(undefined as any)
  ),
  lastName: new RequiredField(Type.text, nameValidations, user.lastName),
});

const fromMaybeUser: FromModel<Maybe<User>> = Maybe.match({
  Just: fromUser,
  Nothing: () => ({
    firstName: new RequiredField(Type.text, nameValidations),
    middleName: new OptionalField(Type.text, nameValidations),
    lastName: new RequiredField(Type.text, nameValidations),
  }),
});

const frank: User = {
  firstName: 'Frank',
  middleName: Maybe.nothing(),
  lastName: 'Tan',
};

const form = fromUser(frank);
const valid = isValid(form);
