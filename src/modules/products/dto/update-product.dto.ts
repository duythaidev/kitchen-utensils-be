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

    @IsString()
    @IsOptional()
    discounted_price: number

    @IsString()
    @IsOptional()
    description: string;
}
