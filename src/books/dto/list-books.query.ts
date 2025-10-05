import {
  IsArray,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
export class ListBooksQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(50)
  limit = 10;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (!value) return [];
    const rawValues = Array.isArray(value) ? value : value.split(',');
    return rawValues
      .map((g: string) => g.trim())
      .filter((g: string) => g.length > 0);
  })
  genres: string[] = [];
}
