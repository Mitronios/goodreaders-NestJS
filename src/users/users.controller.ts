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
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { multerConfig } from 'src/config/multer.config';

import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from 'src/auth/decorators/current-user.decorator';
import { UpdateWantToReadDto } from './dto/update-want-to-read.dto';
import type { CreateUserFormData } from './interfaces/create-user-form-data.interface';
import { UserCreationService } from './services/user-creation.service';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly userCreationService: UserCreationService,
  ) {}

  @Public()
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('avatar', multerConfig))
  async create(
    @UploadedFile() avatar: Express.Multer.File | undefined,
    @Body() body: CreateUserFormData,
  ) {
    return this.userCreationService.createUser({
      formData: body,
      avatarFile: avatar,
    });
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
