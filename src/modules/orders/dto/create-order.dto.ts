import { IsNotEmpty, IsNumber } from "class-validator";

export class CreateOrderDto {

    @IsNotEmpty()
    @IsNumber()
    user_id: number;

    @IsNotEmpty()
    @IsNumber()
    total_price: number;

    @IsNotEmpty()
    address: string;

}
