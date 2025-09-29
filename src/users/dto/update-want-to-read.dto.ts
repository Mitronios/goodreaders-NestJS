import { IsBoolean } from 'class-validator';

export class UpdateWantToReadDto {
  @IsBoolean()
  wantToRead: boolean;
}
