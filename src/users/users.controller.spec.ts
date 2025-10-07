import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UserCreationService } from './services/user-creation.service';
import type { CreateUserFormData } from './interfaces/create-user-form-data.interface';
import type { User } from './schemas/user.schema';
import type { AuthenticatedUser } from '../auth/decorators/current-user.decorator';

type MockUser = Partial<User> & {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  books: unknown[];
  createdAt: Date;
  updatedAt: Date;
};

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: jest.Mocked<UsersService>;
  let userCreationService: jest.Mocked<UserCreationService>;

  const mockCreatedUser: MockUser = {
    _id: '507f1f77bcf86cd799439011',
    name: 'John Doe',
    email: 'john@example.com',
    password: '$2b$10$hashedpassword',
    role: 'user',
    books: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  beforeEach(async () => {
    const mockUsersService = {
      create: jest.fn(),
      findAll: jest.fn(),
      findOne: jest.fn(),
      findByEmail: jest.fn(),
      update: jest.fn(),
      remove: jest.fn(),
      updateWantToReadStatus: jest.fn(),
      getWantToReadStatus: jest.fn(),
    };

    const mockUserCreationService = {
      createUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: UserCreationService,
          useValue: mockUserCreationService,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get(UsersService);
    userCreationService = module.get(UserCreationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    const mockUserData: CreateUserFormData = {
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
      role: 'user',
    };

    it('should create a user successfully with form data', async () => {
      userCreationService.createUser.mockResolvedValue(mockCreatedUser as User);

      const result = await controller.create(undefined, mockUserData);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userCreationService.createUser).toHaveBeenCalledWith({
        formData: mockUserData,
        avatarFile: undefined,
      });
      expect(result).toEqual(mockCreatedUser);
    });

    it('should create a user with avatar file', async () => {
      const mockFile = {
        filename: 'avatar-1234567890.jpg',
        originalname: 'avatar.jpg',
        mimetype: 'image/jpeg',
        size: 1024,
      } as Express.Multer.File;

      userCreationService.createUser.mockResolvedValue(mockCreatedUser as User);

      const result = await controller.create(mockFile, mockUserData);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userCreationService.createUser).toHaveBeenCalledWith({
        formData: mockUserData,
        avatarFile: mockFile,
      });
      expect(result).toEqual(mockCreatedUser);
    });

    it('should handle minimal form data gracefully', async () => {
      const minimalData: CreateUserFormData = {
        name: 'John',
        email: 'john@example.com',
        password: 'password123',
      };

      userCreationService.createUser.mockResolvedValue(mockCreatedUser as User);

      const result = await controller.create(undefined, minimalData);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(userCreationService.createUser).toHaveBeenCalledWith({
        formData: minimalData,
        avatarFile: undefined,
      });
      expect(result).toEqual(mockCreatedUser);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [mockCreatedUser];
      usersService.findAll.mockResolvedValue(mockUsers as User[]);

      const result = await controller.findAll();

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(usersService.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const userId = '507f1f77bcf86cd799439011';
      usersService.findOne.mockResolvedValue(mockCreatedUser as User);

      const result = await controller.findOne(userId);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(usersService.findOne).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockCreatedUser);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const email = 'john@example.com';
      usersService.findByEmail.mockResolvedValue(mockCreatedUser as User);

      const result = await controller.findByEmail(email);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(usersService.findByEmail).toHaveBeenCalledWith(email);
      expect(result).toEqual(mockCreatedUser);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const userId = '507f1f77bcf86cd799439011';
      const updateData = { name: 'Updated Name' };
      usersService.update.mockResolvedValue(mockCreatedUser as User);

      const result = await controller.update(userId, updateData);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(usersService.update).toHaveBeenCalledWith(userId, updateData);
      expect(result).toEqual(mockCreatedUser);
    });
  });

  describe('remove', () => {
    it('should delete a user', async () => {
      const userId = '507f1f77bcf86cd799439011';
      usersService.remove.mockResolvedValue(undefined);

      const result = await controller.remove(userId);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(usersService.remove).toHaveBeenCalledWith(userId);
      expect(result).toBeUndefined();
    });
  });

  describe('updateWantToRead', () => {
    it('should update want to read status', async () => {
      const bookId = '507f1f77bcf86cd799439012';
      const mockUser = {
        userId: '507f1f77bcf86cd799439011',
      } as AuthenticatedUser;
      const statusData = { wantToRead: true };
      usersService.updateWantToReadStatus.mockResolvedValue(
        mockCreatedUser as User,
      );

      const result = await controller.updateWantToRead(
        mockUser,
        bookId,
        statusData,
      );

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(usersService.updateWantToReadStatus).toHaveBeenCalledWith(
        mockUser.userId,
        bookId,
        statusData.wantToRead,
      );
      expect(result).toEqual(mockCreatedUser);
    });
  });

  describe('getWantToReadStatus', () => {
    it('should get want to read status', async () => {
      const bookId = '507f1f77bcf86cd799439012';
      const mockUser = {
        userId: '507f1f77bcf86cd799439011',
      } as AuthenticatedUser;
      const mockStatus = {
        bookId: '507f1f77bcf86cd799439012',
        wantToRead: true,
      };
      usersService.getWantToReadStatus.mockResolvedValue(mockStatus);

      const result = await controller.getWantToReadStatus(mockUser, bookId);

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(usersService.getWantToReadStatus).toHaveBeenCalledWith(
        mockUser.userId,
        bookId,
      );
      expect(result).toEqual(mockStatus);
    });
  });
});
