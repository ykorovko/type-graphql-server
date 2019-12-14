import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
  ValidationOptions
} from "class-validator";
import User from "~/entity/Users";

@ValidatorConstraint({ async: true })
export class isEmailAlreadyExistConstraint
  implements ValidatorConstraintInterface {
  validate(email: string) {
    return User.findOne({ where: { email } }).then(user => {
      if (user) return false;
      return true;
    });
  }
}

export function isEmailAlreadyExist(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      name: "isEmailAlreadyExist",
      target: object.constructor,
      propertyName: propertyName,
      // constraints: [property],
      options: validationOptions,
      validator: isEmailAlreadyExistConstraint
    });
  };
}
