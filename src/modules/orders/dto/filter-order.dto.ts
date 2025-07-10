import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class FilterOrderDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsNumberString()
  page?: string;

  @IsOptional()
  @IsNumberString()
  limit?: string;
}
