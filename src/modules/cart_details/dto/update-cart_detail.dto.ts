import { IsNotEmpty, IsNumber } from 'class-validator';

export class UpdateCartDetailDto {

    @IsNumber()
    @IsNotEmpty()
    quantity: number;

    @IsNumber()
    @IsNotEmpty()
    product_id: number;

    @IsNumber()
    @IsNotEmpty()
    cart_id: number;
}
