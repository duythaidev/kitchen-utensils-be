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

    @IsOptional()
    @IsArray()
    @UniqueTrueInArray({message: 'Only one image can be main'})
    @EqualArrayLength( 'product_images', {message: 'Number of main images must be equal to number of product images'})
    isMain: boolean[];

    @IsOptional()
    @IsArray()
    product_images?: Buffer[];

    // @IsOptional()
    // @IsString()
    // image_url?: string;
}
