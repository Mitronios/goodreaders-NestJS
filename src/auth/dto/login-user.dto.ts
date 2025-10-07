import { IsString, IsEmail, IsOptional } from 'class-validator';

export class LoginUserDto {
  @IsEmail()
  email: string;

  @IsString()
  _id: string;

  @IsString()
  role: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  avatar?: string;
}
