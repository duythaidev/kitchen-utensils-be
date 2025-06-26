import { IsInt, IsNumber, IsOptional, IsString, MaxLength, Min } from "class-validator";

export class CreateProductDto {
    @IsString()
    @MaxLength(100)
    product_name: string

    @IsNumber()
    @Min(0)
    price: number

    @IsInt()
    @Min(1)
    @IsOptional()
    category_id: number

    @IsString()
    @IsOptional()
    description: string
}
