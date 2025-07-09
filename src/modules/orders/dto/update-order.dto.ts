import { IsEnum, IsString } from "class-validator";

export class UpdateOrderDto {
    @IsString()
    @IsEnum(["pending", "processing", "delivered", "cancelled"])
    status: "pending" | "processing" | "delivered" | "cancelled"
}
