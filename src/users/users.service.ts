import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const createdUser = new this.userModel(createUserDto);
      return await createdUser.save();
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email }).exec();
    if (!user) {
      throw new NotFoundException(`User with email ${email} not found`);
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateUserDto, { new: true })
        .exec();

      if (!updatedUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      return updatedUser;
    } catch (error) {
      if (error instanceof Error && 'code' in error && error.code === 11000) {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }

  async count(): Promise<number> {
    return await this.userModel.countDocuments().exec();
  }
}
