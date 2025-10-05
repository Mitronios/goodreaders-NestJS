import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookResponseDto } from './dto/book-response.dto';

describe('BooksController', () => {
  let controller: BooksController;

  const mockBooksService = {
    create: jest.fn(),
    findAllPaged: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    getAllGenres: jest.fn(),
    searchBooks: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BooksController],
      providers: [
        {
          provide: BooksService,
          useValue: mockBooksService,
        },
      ],
    }).compile();

    controller = module.get<BooksController>(BooksController);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a book and return BookResponseDto', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        description: 'Test description',
        review: 'Test review',
        genre: ['Test Genre'],
        rating: 5,
      };

      const mockBookResponse = new BookResponseDto({
        _id: '1',
        ...createBookDto,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      mockBooksService.create.mockResolvedValue(mockBookResponse);

      const result = await controller.create(createBookDto);

      expect(mockBooksService.create).toHaveBeenCalledWith(createBookDto);
      expect(result).toBeInstanceOf(BookResponseDto);
      expect(result.id).toBe('1');
      expect(result.title).toBe('Test Book');
    });
  });

  describe('findAll', () => {
    it('should return all books as BookResponseDto array', async () => {
      const mockBooks = [
        new BookResponseDto({
          _id: '1',
          title: 'Test Book 1',
          author: 'Test Author 1',
          review: 'Review 1',
          genre: ['Genre 1'],
          rating: 4,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
        new BookResponseDto({
          _id: '2',
          title: 'Test Book 2',
          author: 'Test Author 2',
          review: 'Review 2',
          genre: ['Genre 2'],
          rating: 5,
          createdAt: new Date(),
          updatedAt: new Date(),
        }),
      ];

      mockBooksService.findAllPaged.mockResolvedValue(mockBooks);

      const query = { page: 1, limit: 10, genres: [] };
      const result = await controller.findAll(query as any);

      expect(mockBooksService.findAllPaged).toHaveBeenCalledWith(1, 10, []);
      expect(result).toHaveLength(2);
      expect(result[0]).toBeInstanceOf(BookResponseDto);
      expect(result[1]).toBeInstanceOf(BookResponseDto);
    });
  });

  describe('search', () => {
    it('should trim query and delegate to service', async () => {
      const mockBooks: BookResponseDto[] = [];
      mockBooksService.searchBooks.mockResolvedValue(mockBooks);

      const result = await controller.search('  Harry Potter  ');

      expect(mockBooksService.searchBooks).toHaveBeenCalledWith('Harry Potter');
      expect(result).toBe(mockBooks);
    });

    it('should throw BadRequestException when query is empty', () => {
      expect(() => controller.search('   ')).toThrow(BadRequestException);
      expect(mockBooksService.searchBooks).not.toHaveBeenCalled();
    });
  });

  describe('findOne', () => {
    it('should return a BookResponseDto by id', async () => {
      const bookId = '1';
      const mockBook = new BookResponseDto({
        _id: bookId,
        title: 'Test Book',
        author: 'Test Author',
        review: 'Test Review',
        genre: ['Test Genre'],
        rating: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockBooksService.findOne.mockResolvedValue(mockBook);

      const result = await controller.findOne(bookId);

      expect(mockBooksService.findOne).toHaveBeenCalledWith(bookId);
      expect(result).toBeInstanceOf(BookResponseDto);
      expect(result.id).toBe(bookId);
      expect(result.title).toBe('Test Book');
    });
  });

  describe('update', () => {
    it('should update a book and return BookResponseDto', async () => {
      const bookId = '1';
      const updateBookDto: UpdateBookDto = { title: 'Updated Test Book' };
      const mockBook = new BookResponseDto({
        _id: bookId,
        title: 'Updated Test Book',
        author: 'Test Author',
        review: 'Test Review',
        genre: ['Test Genre'],
        rating: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockBooksService.update.mockResolvedValue(mockBook);

      const result = await controller.update(bookId, updateBookDto);

      expect(mockBooksService.update).toHaveBeenCalledWith(
        bookId,
        updateBookDto,
      );
      expect(result).toBeInstanceOf(BookResponseDto);
      expect(result.id).toBe(bookId);
      expect(result.title).toBe('Updated Test Book');
    });
  });

  describe('remove', () => {
    it('should remove a book', async () => {
      const bookId = '1';

      mockBooksService.remove.mockResolvedValue(undefined);

      await controller.remove(bookId);

      expect(mockBooksService.remove).toHaveBeenCalledWith(bookId);
    });
  });

  describe('getAllGenres', () => {
    it('should return an array of unique genres', async () => {
      const mockGenres = ['Fiction', 'Mystery', 'Romance', 'Science Fiction'];

      mockBooksService.getAllGenres.mockResolvedValue(mockGenres);

      const result = await controller.getAllGenres();

      expect(mockBooksService.getAllGenres).toHaveBeenCalled();
      expect(result).toEqual(mockGenres);
      expect(result).toHaveLength(4);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return an empty array when no genres exist', async () => {
      mockBooksService.getAllGenres.mockResolvedValue([]);

      const result = await controller.getAllGenres();

      expect(mockBooksService.getAllGenres).toHaveBeenCalled();
      expect(result).toEqual([]);
      expect(Array.isArray(result)).toBe(true);
    });

    it('should handle service errors and propagate them', async () => {
      const error = new Error('Service error');
      mockBooksService.getAllGenres.mockRejectedValue(error);

      await expect(controller.getAllGenres()).rejects.toThrow('Service error');
      expect(mockBooksService.getAllGenres).toHaveBeenCalled();
    });
  });
});
