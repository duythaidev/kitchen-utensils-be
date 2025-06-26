import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateCartDto {
  
  @IsInt()
  @Min(1)
  user_id: number;

  @IsInt()
  @Min(1)
  product_id: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  quantity: number;
}
