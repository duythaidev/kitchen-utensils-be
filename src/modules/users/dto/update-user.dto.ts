import { IsInt, IsNumberString, IsOptional, IsString, MaxLength, Min, registerDecorator, ValidationOptions } from "class-validator";

export function IsImageFile(options?: ValidationOptions) {
    return (object, propertyName: string) => {
        registerDecorator({
            target: object.constructor,
            propertyName,
            options,
            validator: {
                validate(mimeType) {
                    const acceptMimeTypes = ['image/png', 'image/jpeg'];
                    const fileType = acceptMimeTypes.find((type) => type === mimeType);
                    return !fileType;
                },
            },
        });
    };
}

export class UpdateUserDto {
    @IsString()
    @MaxLength(25)
    @IsOptional()
    user_name: string

    @IsInt()
    @Min(0)
    @IsOptional()
    age: number
    
    @IsOptional()
    avatar: Buffer
}
