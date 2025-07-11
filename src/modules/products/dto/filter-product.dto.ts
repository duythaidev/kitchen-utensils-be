import { IsOptional, IsString, IsNumberString, IsIn, IsArray, IsNumber, } from 'class-validator';

export class FilterProductDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  sort?: string;

  @IsOptional()
  priceSort?: string;

  @IsOptional()
  priceFrom?: number;

  @IsOptional()
  priceTo?: number;

  @IsOptional()
  categoryId?: number;


  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}
