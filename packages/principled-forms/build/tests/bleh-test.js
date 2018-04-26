import { Maybe } from 'true-myth';
import Form from '../form';
import Field, { Type } from '../field';
import Number from '../field/number';
import { minLength, maxLength, minValue } from '../validators';
const nameValidations = [minLength(1), maxLength(40)];
const fromUser = (user) => ({
    age: Number.required({ type: Type.number, validators: [minValue(0)], value: user.age }),
    name: Field.optional({ validators: nameValidations, value: user.name }),
    familyName: Field.optional({ validators: nameValidations, value: user.familyName }),
    middleName: Field.optional()
});
const fromMaybeUser = Maybe.match({
    Just: fromUser,
    Nothing: () => ({
        age: Number.required({ type: Type.number, validators: [minValue(0)] }),
        name: Field.optional({ validators: nameValidations }),
        familyName: Field.optional({ validators: nameValidations }),
        middleName: Field.optional()
    })
});
const chris = {
    name: 'Chris',
    age: 30,
    familyName: Maybe.just('Krycho')
};
const nobody = Maybe.nothing();
const chrisForm = fromUser(chris);
const nobodyForm = fromMaybeUser(nobody);
const validChris = Form.isValid(chrisForm);
const validNobody = Form.isValid(nobodyForm);
