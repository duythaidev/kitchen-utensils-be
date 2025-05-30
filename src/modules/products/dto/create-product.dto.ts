import { IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class CreateProductDto {
    @IsString()
    product_name: string

    @IsNumber()
    @Min(0)
    price: number

    @IsInt()
    @Min(1)
    @IsOptional()
    category_id: number
}
