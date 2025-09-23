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

  describe('findAll', () => {
    it('should return an array of BookResponseDto', async () => {
      const books = [mockBookDocument];

      mockBookModel.find.mockReturnValue({
        exec: jest.fn().mockResolvedValue(books),
      });

      const result = await service.findAll();

      expect(mockBookModel.find).toHaveBeenCalled();
      expect(result).toHaveLength(1);
      expect(result[0]).toBeInstanceOf(BookResponseDto);
      expect(result[0].id).toBe('test-book-id-123');
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
});
