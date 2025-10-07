import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { UserMapper } from './mappers/user.mapper';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';
import { ValidatedUser } from './interfaces/validateUser';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginResponseDto } from './dto/login-response.dto';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let usersService: Partial<Record<keyof UsersService, jest.Mock>>;
  let jwtService: Partial<Record<keyof JwtService, jest.Mock>>;
  let userMapper: Partial<Record<keyof UserMapper, jest.Mock>>;

  beforeEach(async () => {
    usersService = {
      findByEmail: jest.fn(),
    };

    jwtService = {
      sign: jest.fn(),
    };

    userMapper = {
      toValidatedUser: jest.fn(),
      toLoginUserDto: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
        { provide: UserMapper, useValue: userMapper },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data without password if valid credentials', async () => {
      const mockUser = {
        email: 'test@example.com',
        password: 'hashedPass',
        role: 'user',
        _id: '111',
        name: 'Test User',
        avatar: 'avatar.jpg',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
        toObject() {
          return {
            email: this.email,
            password: this.password,
            role: this.role,
            _id: this._id,
            name: this.name,
            avatar: this.avatar,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
          };
        },
      };

      const expectedValidatedUser: ValidatedUser = {
        email: 'test@example.com',
        role: 'user',
        _id: '111',
        name: 'Test User',
        avatar: 'avatar.jpg',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      };

      usersService.findByEmail!.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      userMapper.toValidatedUser!.mockReturnValue(expectedValidatedUser);

      const result: ValidatedUser = await service.validateUser(
        'test@example.com',
        'password',
      );

      expect(usersService.findByEmail).toHaveBeenCalledWith('test@example.com');
      expect(userMapper.toValidatedUser).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(expectedValidatedUser);
    });

    it('should throw UnauthorizedException if wrong password', async () => {
      const mockUser = {
        email: 'test@example.com',
        password: 'hashedPass',
        toObject() {
          return { email: this.email, password: this.password };
        },
      };

      usersService.findByEmail!.mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.validateUser('test@example.com', 'wrongpass'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('login', () => {
    it('should return a JWT token and user data', () => {
      const mockLoginUserDto: LoginUserDto = {
        email: 'test@example.com',
        _id: '111',
        role: 'user',
        name: 'Test User',
        avatar: 'avatar.jpg',
      };
      const mockToken = 'mockedJwtToken';

      jwtService.sign!.mockReturnValue(mockToken);

      const result = service.login(mockLoginUserDto);

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: mockLoginUserDto.email,
        sub: mockLoginUserDto._id,
        role: mockLoginUserDto.role,
      });
      expect(result).toBeInstanceOf(LoginResponseDto);
      expect(result.access_token).toBe(mockToken);
      expect(result.user).toEqual({
        id: '111',
        email: 'test@example.com',
        role: 'user',
        avatar: 'avatar.jpg',
      });
    });
  });
});
