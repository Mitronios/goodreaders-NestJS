import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { ValidatedUser } from './interfaces/validateUser';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
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

    const { password: _, ...result } = user.toObject();
    return {...result,
      name: result.name,
      avatar: result.avatar || null,
    } as ValidatedUser;
  }

  login(user: {
    email: string;
    _id: string;
    role: string;
    name?: string;
    avatar?: string;
  }) {
    const payload: JwtPayload = {
      email: user.email,
      sub: user._id,
      role: user.role,
    };

    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user._id.toString(),
        email: user.email,
        role: user.role || null,
        avatar: user.avatar || null,
      },
    };
  }
}
