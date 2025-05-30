import { IsString, MaxLength, IsNotEmpty } from "class-validator";

export class CreateCategoryDto {
    @MaxLength(25)
    @IsNotEmpty()
    category_name: string;
}