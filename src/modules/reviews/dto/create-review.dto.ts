import { IsNotEmpty, IsNumber, IsString, Max, Min } from 'class-validator';

export class CreateReviewDto {
    @IsNotEmpty()
    @IsNumber()
    product_id: number;

    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(5)
    rating: number;

    @IsString()
    comment: string;
}
