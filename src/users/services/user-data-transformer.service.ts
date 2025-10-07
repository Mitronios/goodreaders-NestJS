import { Injectable, BadRequestException } from '@nestjs/common';
import { plainToInstance, validate } from 'class-transformer';
import { CreateUserDto } from '../dto/create-user.dto';
import type { CreateUserFormData } from '../interfaces/create-user-form-data.interface';

export interface TransformedUserData {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  role: string;
}

@Injectable()
export class UserDataTransformer {
  /**
   * Transforms and validates form data into CreateUserDto
   */
  async transformAndValidate(
    formData: CreateUserFormData,
    avatarPath?: string,
  ): Promise<CreateUserDto> {
    const userData: TransformedUserData = {
      name: formData.name?.trim() ?? '',
      email: formData.email?.trim() ?? '',
      password: formData.password ?? '',
      avatar: avatarPath,
      role: formData.role ?? 'user',
    };

    const userDto = plainToInstance(CreateUserDto, userData);

    const errors = await validate(userDto);
    if (errors.length > 0) {
      const messages: string[] = errors
        .map(error =>
          error.constraints ? Object.values(error.constraints) : [],
        )
        .flat();
      throw new BadRequestException(messages);
    }

    return userDto;
  }
}
