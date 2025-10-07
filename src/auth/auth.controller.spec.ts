import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserMapper } from './mappers/user.mapper';
import { LoginDto } from './dto/login.dto';
import { ValidatedUser } from './interfaces/validateUser';
import { LoginUserDto } from './dto/login-user.dto';
import { LoginResponseDto } from './dto/login-response.dto';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  const mockUserMapper = {
    toLoginUserDto: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: UserMapper,
          useValue: mockUserMapper,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call AuthService.validateUser, UserMapper.toLoginUserDto, and AuthService.login', async () => {
      const loginDto: LoginDto = {
        email: 'test@example.com',
        password: '123456',
      };

      const mockValidatedUser: ValidatedUser = {
        _id: 'userId1',
        email: loginDto.email,
        role: 'user',
        name: 'Test User',
        avatar: 'avatar.jpg',
        createdAt: new Date('2023-01-01'),
        updatedAt: new Date('2023-01-01'),
      };

      const mockLoginUserDto: LoginUserDto = {
        email: loginDto.email,
        _id: 'userId1',
        role: 'user',
        name: 'Test User',
        avatar: 'avatar.jpg',
      };

      const mockLoginResponse = new LoginResponseDto('jwtSimulatedToken', {
        id: 'userId1',
        email: loginDto.email,
        role: 'user',
        avatar: 'avatar.jpg',
      });

      mockAuthService.validateUser.mockResolvedValue(mockValidatedUser);
      mockUserMapper.toLoginUserDto.mockReturnValue(mockLoginUserDto);
      mockAuthService.login.mockReturnValue(mockLoginResponse);

      const result = await controller.login(loginDto);

      expect(mockAuthService.validateUser).toHaveBeenCalledWith(
        loginDto.email,
        loginDto.password,
      );
      expect(mockUserMapper.toLoginUserDto).toHaveBeenCalledWith(
        mockValidatedUser,
      );
      expect(mockAuthService.login).toHaveBeenCalledWith(mockLoginUserDto);
      expect(result).toBe(mockLoginResponse);
    });

    it('should throw error if validateUser fails', async () => {
      const loginDto: LoginDto = {
        email: 'wrong@example.com',
        password: 'wrongpass',
      };

      mockAuthService.validateUser.mockRejectedValue(
        new Error('Invalid credentials'),
      );

      await expect(controller.login(loginDto)).rejects.toThrow(
        'Invalid credentials',
      );
    });
  });

  describe('logout', () => {
    it('should return logout message', () => {
      const result = controller.logout();
      expect(result).toEqual({ message: 'Logout successful' });
    });
  });
});
