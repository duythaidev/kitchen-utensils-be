import { IsInt, Min, IsNumber } from "class-validator";

export class CreateOrderDetailDto {
    @IsInt()
    @Min(1)
    order_id: number;

    @IsInt()
    @Min(1)
    product_id: number;

    @IsInt()
    @Min(1)
    quantity: number;

    @IsNumber()
    @Min(0)
    price: number; // giá tại thời điểm mua
}


