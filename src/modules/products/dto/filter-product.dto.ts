import {
    IsOptional,
    IsString,
    IsNumberString,
    IsIn,
    IsArray,
  } from 'class-validator';
  import { Transform } from 'class-transformer';
  
  export class FilterProductDto {
    @IsOptional()
    @IsString()
    keyword?: string;
  
    @IsOptional()
    @IsIn(['newest', 'bestseller'])
    sort?: string;
  
    @IsOptional()
    @IsIn(['htl', 'lth']) // high to low, low to high
    priceSort?: string;
  
    @IsOptional()
    @IsNumberString()
    priceFrom?: string;
  
    @IsOptional()
    @IsNumberString()
    priceTo?: string;
  
    @IsOptional()
    @Transform(({ value }) =>
      Array.isArray(value) ? value.map(Number) : value.split(',').map(Number),
    )
    category?: number[];
  
    @IsOptional()
    @IsNumberString()
    page?: string;
  
    @IsOptional()
    @IsNumberString()
    limit?: string;
  }
  