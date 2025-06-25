import { IsNotEmpty, IsNumber, Max } from "class-validator";

export class CreateReviewDto {
    @IsNumber({ maxDecimalPlaces: 1 }, { message: 'Rating must be a number with one decimal place. (e.g: 4.5)' })
    @IsNotEmpty()
    @Max(5, { message: 'Rating must be between 0 and 5.' })
    rating: number;

}
