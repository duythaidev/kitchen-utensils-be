import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    email: string;

    @IsNotEmpty()
    password: string;

    avatar_url?: string;
}
