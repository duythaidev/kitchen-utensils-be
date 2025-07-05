import { PartialType } from '@nestjs/mapped-types';
import { CreateProductDto } from './create-product.dto';
import { IsNumber, IsInt, Min, IsOptional } from 'class-validator';
import { IsString } from 'class-validator';

export class UpdateProductDto extends PartialType(CreateProductDto) {
    @IsString()
    product_name: string

    @IsNumber()
    @Min(0)
    price: number

    @IsInt()
    @IsOptional()
    @Min(1)
    category_id: number

    @IsNumber()
    @IsOptional()
    @Min(0)
    discounted_price: number

    @IsInt()
    @IsOptional()
    @Min(0)
    stock: number

    @IsString()
    @IsOptional()
    description: string;
}
