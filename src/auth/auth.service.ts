import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { ValidatedUser } from './interfaces/validateUser';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { UserMapper } from './mappers/user.mapper';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private userMapper: UserMapper,
  ) {}

  async validateUser(email: string, pass: string): Promise<ValidatedUser> {
    const user = await this.usersService.findByEmail(email).catch(() => null);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(pass, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.userMapper.toValidatedUser(user);
  }

  login(user: LoginUserDto): LoginResponseDto {
    const payload: JwtPayload = {
      email: user.email,
      sub: user._id,
      role: user.role,
    };

    const access_token = this.jwtService.sign(payload);

    return new LoginResponseDto(access_token, {
      id: user._id,
      email: user.email,
      role: user.role ?? null,
      avatar: user.avatar ?? null,
    });
  }
}
