import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ChangePasswordDto {
    @IsNotEmpty()
    @IsString()
    oldPassword: string;

    @IsNotEmpty()
    @IsString()
    newPassword: string;

    @IsOptional()
    @IsString()
    confirmNewPassword?: string;
}
