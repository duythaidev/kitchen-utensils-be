import { ValidationOptions, registerDecorator, ValidationArguments } from "class-validator";

export function EqualArrayLength(property: string, validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'equalArrayLength',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return value.length === relatedValue.length;
        },
      },
    });
  };
}