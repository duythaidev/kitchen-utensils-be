import { IsNotEmpty, IsNumber, IsOptional, IsArray } from 'class-validator';

export class UpdateProductImageDto {
    @IsNotEmpty()
    @IsNumber()
    product_id: number;

    // index of main image
    @IsOptional()
    @IsNumber()
    isMain: number;

    @IsOptional()
    @IsArray()
    product_images?: Buffer[];
}
