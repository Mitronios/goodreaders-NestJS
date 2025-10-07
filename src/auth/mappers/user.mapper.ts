import { Injectable } from '@nestjs/common';
import { User } from 'src/users/schemas/user.schema';
import { ValidatedUser } from '../interfaces/validateUser';
import { LoginUserDto } from '../dto/login-user.dto';

@Injectable()
export class UserMapper {
  /**
   * Safely transforms a User document to ValidatedUser interface
   * @param user - The User document from MongoDB
   * @returns ValidatedUser object without password
   */
  toValidatedUser(user: User): ValidatedUser {
    const userObject = user.toObject();

    return {
      _id: userObject._id.toString(),
      email: userObject.email,
      name: userObject.name,
      role: userObject.role,
      avatar: userObject.avatar ?? null,
      createdAt: userObject.createdAt,
      updatedAt: userObject.updatedAt,
    };
  }

  /**
   * Transforms ValidatedUser to LoginUserDto for login method
   * @param validatedUser - The validated user data
   * @returns LoginUserDto object
   */
  toLoginUserDto(validatedUser: ValidatedUser): LoginUserDto {
    return {
      email: validatedUser.email,
      _id: validatedUser._id,
      role: validatedUser.role,
      name: validatedUser.name,
      avatar: validatedUser.avatar ?? undefined,
    };
  }

  /**
   * Safely extracts user data from User document for login
   * @param user - The User document from MongoDB
   * @returns LoginUserDto object
   */
  toLoginUserDtoFromUser(user: User): LoginUserDto {
    const userObject = user.toObject();

    return {
      email: userObject.email,
      _id: userObject._id.toString(),
      role: userObject.role,
      name: userObject.name,
      avatar: userObject.avatar ?? undefined,
    };
  }
}
