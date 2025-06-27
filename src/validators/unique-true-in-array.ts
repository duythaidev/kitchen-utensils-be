import { ValidationOptions, registerDecorator, ValidationArguments } from "class-validator";

export function UniqueTrueInArray(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'uniqueTrueInArray',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: boolean[], args: ValidationArguments) {
          let count = 0;
          value.forEach(item => {
            if (item === true) {
              count++;
            }
          });
          return count === 1;
        },
      },
    });
  };
}