import { IsEmail, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class CreateUserGoogleDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    user_name?: string;

    @IsOptional()
    avatar_url?: string;

    @IsOptional()
    auth_provider?: string;
}
