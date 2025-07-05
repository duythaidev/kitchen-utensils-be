import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsOptional()
    user_name?: string;

    @IsOptional()
    address?: string;

    @IsOptional()
    phone?: string;

    @IsOptional()
    role?: string;

    @IsOptional()
    avatar_url?: string;

    @IsOptional()
    auth_provider?: string;
}
