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
    user_name: string

    @IsOptional()
    avatar_url?: string;

    // @IsOptional()
    // avatar?: Express.Multer.File;

    @IsOptional()
    role?: string;

    @IsString()
    @IsOptional()
    phone?: string;
    
    @IsString()
    @MaxLength(100)
    @IsOptional()
    address?: string;
}
