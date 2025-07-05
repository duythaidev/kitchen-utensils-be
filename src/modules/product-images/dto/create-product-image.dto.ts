import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsNumber, IsArray } from 'class-validator';
import { EqualArrayLength } from 'src/validators/equal-array-length';
import { UniqueTrueInArray } from 'src/validators/unique-true-in-array';

export class CreateProductImageDto {
    // @IsNotEmpty()
    // @IsString()
    // image_url: string;

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

    // @IsOptional()
    // @IsString()
    // image_url?: string;

    // @IsOptional()
    // @IsString()
    // image_url?: string;
}
