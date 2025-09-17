import {
  IsArray,
  ArrayNotEmpty,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  author: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  @IsNotEmpty()
  review: string;

  @IsOptional()
  @IsUrl()
  cover?: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  genre: string[];

  @IsOptional()
  @IsBoolean()
  wantToRead = false;

  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;
}
