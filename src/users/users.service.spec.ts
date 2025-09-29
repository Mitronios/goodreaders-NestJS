import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

describe('UsersService', () => {
  let service: UsersService;
  let mockUserModel: {
    new: jest.Mock;
    find: jest.Mock;
    findById: jest.Mock;
    findOne: jest.Mock;
    findByIdAndUpdate: jest.Mock;
    findByIdAndDelete: jest.Mock;
    countDocuments: jest.Mock;
  };

  beforeEach(async () => {
    mockUserModel = {
      new: jest.fn(),
      find: jest.fn(),
      findById: jest.fn(),
      findOne: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findByIdAndDelete: jest.fn(),
      countDocuments: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('updateWantToReadStatus', () => {
    const makeExec = <T>(value: T) => ({
      exec: jest.fn<Promise<T>, []>(() => Promise.resolve(value)),
    });

    it('throws BadRequestException when bookId is empty after trim', async () => {
      await expect(
        service.updateWantToReadStatus('user-id', '   ', true),
      ).rejects.toBeInstanceOf(BadRequestException);

      expect(mockUserModel.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    it('throws NotFoundException when user does not exist', async () => {
      mockUserModel.findByIdAndUpdate.mockReturnValueOnce(makeExec(null));

      await expect(
        service.updateWantToReadStatus('user-id', 'book-1', true),
      ).rejects.toBeInstanceOf(NotFoundException);

      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'user-id',
        { $pull: { books: { bookId: 'book-1' } } },
        { new: false },
      );
    });

    it('adds a book when wantToRead is true', async () => {
      const existingUser = { _id: 'user-id' } as unknown as User;
      const updatedUser = { _id: 'user-id', books: [] } as unknown as User;

      mockUserModel.findByIdAndUpdate
        .mockReturnValueOnce(makeExec(existingUser))
        .mockReturnValueOnce(makeExec(updatedUser));

      const result = await service.updateWantToReadStatus(
        'user-id',
        '  book-1  ',
        true,
      );

      expect(mockUserModel.findByIdAndUpdate).toHaveBeenNthCalledWith(
        1,
        'user-id',
        { $pull: { books: { bookId: 'book-1' } } },
        { new: false },
      );

      expect(mockUserModel.findByIdAndUpdate).toHaveBeenNthCalledWith(
        2,
        'user-id',
        { $push: { books: { bookId: 'book-1', wantToRead: true } } },
        { new: true },
      );

      expect(result).toBe(updatedUser);
    });

    it('removes a book when wantToRead is false', async () => {
      const updatedUser = { _id: 'user-id', books: [] } as unknown as User;

      mockUserModel.findByIdAndUpdate.mockReturnValueOnce(
        makeExec(updatedUser),
      );

      const result = await service.updateWantToReadStatus(
        'user-id',
        'book-1',
        false,
      );

      expect(mockUserModel.findByIdAndUpdate).toHaveBeenCalledWith(
        'user-id',
        { $pull: { books: { bookId: 'book-1' } } },
        { new: true },
      );
      expect(result).toBe(updatedUser);
    });
  });
});
