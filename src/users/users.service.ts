import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { User } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const userData = { ...createUserDto, password: hashedPassword };

      const createdUser = new this.userModel(userData);
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
      const updateData = { ...updateUserDto };
      if (updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10);
      }

      const updatedUser = await this.userModel
        .findByIdAndUpdate(id, updateData, { new: true })
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

  async updateWantToReadStatus(
    userId: string,
    bookId: string,
    wantToRead: boolean,
  ): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    const normalizedBookId = bookId.trim();
    if (!normalizedBookId) {
      throw new BadRequestException('Book ID cannot be empty');
    }

    const entriesByBookId = new Map<
      string,
      { bookId: string; wantToRead: boolean }
    >();

    if (Array.isArray(user.books)) {
      for (const entry of user.books) {
        if (!entry || typeof entry.bookId !== 'string') {
          continue;
        }

        const entryBookId = entry.bookId.trim();
        if (!entryBookId) {
          continue;
        }

        entriesByBookId.set(entryBookId, {
          bookId: entryBookId,
          wantToRead: Boolean(entry.wantToRead),
        });
      }
    }

    if (wantToRead) {
      entriesByBookId.set(normalizedBookId, {
        bookId: normalizedBookId,
        wantToRead: true,
      });
    } else {
      entriesByBookId.delete(normalizedBookId);
    }

    user.books = Array.from(entriesByBookId.values());
    user.markModified('books');

    return await user.save();
  }

  async remove(id: string): Promise<void> {
    const result = await this.userModel.findByIdAndDelete(id).exec();
    if (!result) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
  }
}
