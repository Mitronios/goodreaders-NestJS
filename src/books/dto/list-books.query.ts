import { IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

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
}
