import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UserMapper } from './mappers/user.mapper';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userMapper: UserMapper,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body(ValidationPipe) loginDto: LoginDto) {
    const validatedUser = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );
    const loginUserDto = this.userMapper.toLoginUserDto(validatedUser);
    return this.authService.login(loginUserDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout() {
    return { message: 'Logout successful' };
  }
}
