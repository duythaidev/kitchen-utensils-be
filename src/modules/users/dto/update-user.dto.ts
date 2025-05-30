import { IsInt, IsNumberString, IsString, MaxLength, Min } from "class-validator";

export class UpdateUserDto {
    @IsString()
    @MaxLength(25)
    user_name: string

    @IsInt()
    @Min(0)
    age: number

}
