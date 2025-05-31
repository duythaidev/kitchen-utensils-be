import { PartialType } from '@nestjs/mapped-types';
import { CreateCartDto } from './create-cart.dto';
import { IsInt, IsOptional, Min } from 'class-validator';

export class UpdateCartDto extends PartialType(CreateCartDto) {
  
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
