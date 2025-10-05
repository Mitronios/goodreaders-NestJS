import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { BooksService } from './books.service';
import { Book } from './schemas/book.schema';
import { NotFoundException } from '@nestjs/common';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookResponseDto } from './dto/book-response.dto';

describe('BooksService', () => {
  let service: BooksService;
  let mockBookModel: any;

  const mockBookDocument = {
    _id: 'test-book-id-123',
    title: 'Test Book',
    author: 'Test Author',
    description: 'Test description',
    review: 'Test review',
    genre: ['Test Genre'],
    rating: 5,
    createdAt: new Date(),
    updatedAt: new Date(),
    save: jest.fn(),
  };

  const mockModel = {
    create: jest.fn(),
    find: jest.fn(),
    findById: jest.fn(),
    findByIdAndUpdate: jest.fn(),
    deleteOne: jest.fn(),
    distinct: jest.fn(),
    countDocuments: jest.fn(),
    exec: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BooksService,
        {
          provide: getModelToken(Book.name),
          useValue: mockModel,
        },
      ],
    }).compile();

    service = module.get<BooksService>(BooksService);
    mockBookModel = module.get(getModelToken(Book.name));
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new book and return BookResponseDto', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        description: 'Test description',
        review: 'Test review',
        genre: ['Test Genre'],
        rating: 5,
      };

      mockBookModel.create.mockResolvedValue(mockBookDocument);

      const result = await service.create(createBookDto);

      expect(mockBookModel.create).toHaveBeenCalledWith(createBookDto);
      expect(result).toBeInstanceOf(BookResponseDto);
      expect(result.id).toBe('test-book-id-123');
      expect(result.title).toBe('Test Book');
      expect(result.author).toBe('Test Author');
    });
  });

  describe('findAllPaged', () => {
    it('should return paginated books without genre filters', async () => {
      const books = [mockBookDocument];
      const execBooks = jest.fn().mockResolvedValue(books);
      const limit = jest.fn().mockReturnValue({ exec: execBooks });
      const skip = jest.fn().mockReturnValue({ limit });
      const execCount = jest.fn().mockResolvedValue(books.length);

      mockBookModel.find.mockReturnValue({ skip });
      mockBookModel.countDocuments.mockReturnValue({ exec: execCount });

      const result = await service.findAllPaged(1, 10);

      expect(mockBookModel.find).toHaveBeenCalledWith({});
      expect(skip).toHaveBeenCalledWith(0);
      expect(limit).toHaveBeenCalledWith(10);
      expect(execBooks).toHaveBeenCalled();
      expect(mockBookModel.countDocuments).toHaveBeenCalledWith({});
      expect(execCount).toHaveBeenCalled();
      expect(result.items).toHaveLength(1);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
      expect(result.pages).toBe(1);
    });

    it('should apply genre filter when provided', async () => {
      const books = [mockBookDocument];
      const execBooks = jest.fn().mockResolvedValue(books);
      const limit = jest.fn().mockReturnValue({ exec: execBooks });
      const skip = jest.fn().mockReturnValue({ limit });
      const execCount = jest.fn().mockResolvedValue(books.length);
      const genres = ['Fantasy', 'Sci-Fi'];

      mockBookModel.find.mockReturnValue({ skip });
      mockBookModel.countDocuments.mockReturnValue({ exec: execCount });

      await service.findAllPaged(2, 5, genres);

      const expectedFilter = { genre: { $in: genres } };
      expect(mockBookModel.find).toHaveBeenCalledWith(expectedFilter);
      expect(skip).toHaveBeenCalledWith(5);
      expect(limit).toHaveBeenCalledWith(5);
      expect(mockBookModel.countDocuments).toHaveBeenCalledWith(
        expectedFilter,
      );
    });

    it('should handle empty genre arrays gracefully', async () => {
      const books = [mockBookDocument];
      const execBooks = jest.fn().mockResolvedValue(books);
      const limit = jest.fn().mockReturnValue({ exec: execBooks });
      const skip = jest.fn().mockReturnValue({ limit });
      const execCount = jest.fn().mockResolvedValue(books.length);

      mockBookModel.find.mockReturnValue({ skip });
      mockBookModel.countDocuments.mockReturnValue({ exec: execCount });

      await service.findAllPaged(3, 20, []);

      expect(mockBookModel.find).toHaveBeenCalledWith({});
    });
  });

  describe('findOne', () => {
    it('should return a BookResponseDto by id', async () => {
      const bookId = 'test-book-id-123';

      mockBookModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockBookDocument),
      });

      const result = await service.findOne(bookId);

      expect(mockBookModel.findById).toHaveBeenCalledWith(bookId);
      expect(result).toBeInstanceOf(BookResponseDto);
      expect(result.id).toBe('test-book-id-123');
      expect(result.title).toBe('Test Book');
    });

    it('should throw NotFoundException when book not found', async () => {
      const bookId = 'non-existent-id';

      mockBookModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.findOne(bookId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a book and return BookResponseDto', async () => {
      const bookId = 'test-book-id-123';
      const updateBookDto: UpdateBookDto = { title: 'Updated Test Book' };
      const updatedBook = { ...mockBookDocument, ...updateBookDto };

      mockBookModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(updatedBook),
      });

      const result = await service.update(bookId, updateBookDto);

      expect(mockBookModel.findByIdAndUpdate).toHaveBeenCalledWith(
        bookId,
        updateBookDto,
        { new: true },
      );
      expect(result).toBeInstanceOf(BookResponseDto);
      expect(result.id).toBe('test-book-id-123');
      expect(result.title).toBe('Updated Test Book');
    });

    it('should throw NotFoundException when book to update not found', async () => {
      const bookId = 'non-existent-id';
      const updateBookDto: UpdateBookDto = { title: 'Updated Test Book' };

      mockBookModel.findByIdAndUpdate.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(service.update(bookId, updateBookDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should remove a book', async () => {
      const bookId = 'test-book-id-123';

      mockBookModel.deleteOne.mockResolvedValue({ deletedCount: 1 });

      await service.remove(bookId);

      expect(mockBookModel.deleteOne).toHaveBeenCalledWith({ _id: bookId });
    });

    it('should throw NotFoundException when book to remove not found', async () => {
      const bookId = 'non-existent-id';

      mockBookModel.deleteOne.mockResolvedValue({ deletedCount: 0 });

      await expect(service.remove(bookId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllGenres', () => {
    it('should return an array of unique genres', async () => {
      const mockGenres = ['Fiction', 'Mystery', 'Romance', 'Science Fiction'];

      mockBookModel.distinct.mockResolvedValue(mockGenres);

      const result = await service.getAllGenres();

      expect(mockBookModel.distinct).toHaveBeenCalledWith('genre');
      expect(result).toEqual(mockGenres);
      expect(result).toHaveLength(4);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return an empty array when no genres exist', async () => {
      mockBookModel.distinct.mockResolvedValue([]);

      const result = await service.getAllGenres();

      expect(mockBookModel.distinct).toHaveBeenCalledWith('genre');
      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle database errors gracefully', async () => {
      const error = new Error('Database connection failed');
      mockBookModel.distinct.mockRejectedValue(error);

      await expect(service.getAllGenres()).rejects.toThrow(
        'Database connection failed',
      );
      expect(mockBookModel.distinct).toHaveBeenCalledWith('genre');
    });
  });

  describe('searchBooks', () => {
    it('should return books matching the query in title or author', async () => {
      const exec = jest.fn().mockResolvedValue([mockBookDocument]);

      mockBookModel.find.mockReturnValue({ exec });

      const result = await service.searchBooks('Test');

      expect(mockBookModel.find).toHaveBeenCalledWith({
        $or: [{ title: expect.any(RegExp) }, { author: expect.any(RegExp) }],
      });
      expect(exec).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(BookResponseDto);
      expect(result[0].title).toBe('Test Book');
    });

    it('should return an empty array if query is empty or only spaces', async () => {
      const result1 = await service.searchBooks('');
      const result2 = await service.searchBooks('   ');

      expect(result1).toEqual([]);
      expect(result2).toEqual([]);
      expect(mockBookModel.find).not.toHaveBeenCalled();
    });
  });
});
