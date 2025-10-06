import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  ValidationPipe,
  Query,
  UseGuards,
  UploadedFile,
  UseInterceptors,
  BadRequestException,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from 'src/auth/decorators/current-user.decorator';
import { UpdateWantToReadDto } from './dto/update-want-to-read.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('avatar'))
  async create(@UploadedFile() avatar: any, @Body() body: any) {
    const userDto = plainToInstance(CreateUserDto, {
      ...body,
      avatar: avatar && avatar.filename ? avatar.filename : undefined,
    });

    const errors = await validate(userDto);
    if (errors.length > 0) {
      const messages = errors
        .map(error =>
          error.constraints ? Object.values(error.constraints) : [],
        )
        .flat();
      throw new BadRequestException(messages);
    }

    return this.usersService.create(userDto);
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get('search')
  async findByEmail(@Query('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Get('want-to-read/:bookId')
  async getWantToReadStatus(
    @CurrentUser() user: AuthenticatedUser,
    @Param('bookId') bookId: string,
  ) {
    return await this.usersService.getWantToReadStatus(user.userId, bookId);
  }

  @Patch('want-to-read/:bookId')
  async updateWantToRead(
    @CurrentUser() user: AuthenticatedUser,
    @Param('bookId') bookId: string,
    @Body(ValidationPipe) updateWantToReadDto: UpdateWantToReadDto,
  ) {
    return await this.usersService.updateWantToReadStatus(
      user.userId,
      bookId,
      updateWantToReadDto.wantToRead,
    );
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body(ValidationPipe) updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    await this.usersService.remove(id);
  }
}
