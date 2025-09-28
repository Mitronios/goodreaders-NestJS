import { IsBoolean } from 'class-validator';

export class UpdateWantToReadDto {
  @IsBoolean()
  want_to_read: boolean;
}
