// dto/filter-user.dto.ts
import { IsOptional, IsString, IsNumberString } from 'class-validator';

export class FilterUserDto {
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
