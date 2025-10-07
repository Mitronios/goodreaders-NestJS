import { Injectable } from '@nestjs/common';
import { UsersService } from '../users.service';
import { UserDataTransformer } from './user-data-transformer.service';
import { FileUploadService } from './file-upload.service';
import type { CreateUserFormData } from '../interfaces/create-user-form-data.interface';
import type { User } from '../schemas/user.schema';

export interface UserCreationRequest {
  formData: CreateUserFormData;
  avatarFile?: Express.Multer.File;
}

@Injectable()
export class UserCreationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly userDataTransformer: UserDataTransformer,
    private readonly fileUploadService: FileUploadService,
  ) {}

  /**
   * Orchestrates the complete user creation process
   */
  async createUser(request: UserCreationRequest): Promise<User> {
    const fileResult = this.fileUploadService.processAvatarUpload(
      request.avatarFile,
    );

    const userDto = await this.userDataTransformer.transformAndValidate(
      request.formData,
      fileResult?.path,
    );

    return this.usersService.create(userDto);
  }
}
