import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class FilterCategoryDto {
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
