import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { UsersService } from './users.service';
import { User } from './schemas/user.schema';

type UserBookEntry = {
  bookId: string;
  wantToRead: boolean;
};

class MockUserDocument {
  books: UserBookEntry[];
  markModified = jest.fn<void, [string]>();
  save = jest.fn<Promise<MockUserDocument>, []>(() => Promise.resolve(this));

  constructor(entries: UserBookEntry[]) {
    this.books = entries;
  }
}

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
    const makeExec = <T>(resolvedValue: T) => ({
      exec: jest.fn<Promise<T>, []>(() => Promise.resolve(resolvedValue)),
    });

    it('throws NotFoundException when user is missing', async () => {
      mockUserModel.findById.mockReturnValue(makeExec(null));

      await expect(
        service.updateWantToReadStatus('user-id', 'book-1', true),
      ).rejects.toBeInstanceOf(NotFoundException);
    });

    it('throws BadRequestException when bookId is empty after trim', async () => {
      const userDoc = new MockUserDocument([]);
      mockUserModel.findById.mockReturnValue(makeExec(userDoc));

      await expect(
        service.updateWantToReadStatus('user-id', '   ', true),
      ).rejects.toBeInstanceOf(BadRequestException);
    });

    it('adds a new entry when book is not present', async () => {
      const userDoc = new MockUserDocument([]);
      mockUserModel.findById.mockReturnValue(makeExec(userDoc));

      const result = await service.updateWantToReadStatus(
        'user-id',
        '  book-1  ',
        true,
      );

      expect(userDoc.books).toEqual([{ bookId: 'book-1', wantToRead: true }]);
      expect(result).toBe(userDoc);
      expect(userDoc.markModified).toHaveBeenCalledWith('books');
      expect(userDoc.save).toHaveBeenCalledTimes(1);
    });

    it('updates existing entry when book is already tracked', async () => {
      const userDoc = new MockUserDocument([
        { bookId: 'book-1', wantToRead: false },
      ]);
      mockUserModel.findById.mockReturnValue(makeExec(userDoc));

      const result = await service.updateWantToReadStatus(
        'user-id',
        'book-1',
        true,
      );

      expect(userDoc.books).toEqual([{ bookId: 'book-1', wantToRead: true }]);
      expect(result).toBe(userDoc);
      expect(userDoc.markModified).toHaveBeenCalledWith('books');
      expect(userDoc.save).toHaveBeenCalledTimes(1);
    });

    it('removes an entry when wantToRead is set to false', async () => {
      const userDoc = new MockUserDocument([
        { bookId: 'book-1', wantToRead: true },
      ]);
      mockUserModel.findById.mockReturnValue(makeExec(userDoc));

      const result = await service.updateWantToReadStatus(
        'user-id',
        'book-1',
        false,
      );

      expect(userDoc.books).toEqual([]);
      expect(result).toBe(userDoc);
      expect(userDoc.markModified).toHaveBeenCalledWith('books');
      expect(userDoc.save).toHaveBeenCalledTimes(1);
    });

    it('removes duplicate entries for the same book keeping the latest state', async () => {
      const userDoc = new MockUserDocument([
        { bookId: 'book-1', wantToRead: true },
        { bookId: 'book-1', wantToRead: false },
        { bookId: 'book-2', wantToRead: true },
      ]);
      mockUserModel.findById.mockReturnValue(makeExec(userDoc));

      const result = await service.updateWantToReadStatus(
        'user-id',
        'book-1',
        false,
      );

      expect(userDoc.books).toEqual([{ bookId: 'book-2', wantToRead: true }]);
      expect(result).toBe(userDoc);
      expect(userDoc.markModified).toHaveBeenCalledWith('books');
      expect(userDoc.save).toHaveBeenCalledTimes(1);
    });
  });
});
