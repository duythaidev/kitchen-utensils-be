import { IsNotEmpty, IsString, IsBoolean, IsOptional, IsNumber } from 'class-validator';

export class CreateProductImageDto {
    // @IsNotEmpty()
    // @IsString()
    // image_url: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsNotEmpty()
    @IsNumber()
    product_id: number;

    @IsOptional()
    @IsBoolean()
    isMain?: boolean;
}
