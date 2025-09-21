import { Test, TestingModule } from '@nestjs/testing';
import { BooksController } from './books.controller';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

describe('BooksController', () => {
  let controller: BooksController;
  let service: BooksService;

  const mockBooksService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
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
    service = module.get<BooksService>(BooksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a book', async () => {
      const createBookDto: CreateBookDto = {
        title: 'Test Book',
        author: 'Test Author',
        description: 'Test description',
        review: 'Test review',
        genre: ['Test Genre'],
        rating: 5,
      };

      const mockBook = { id: '1', ...createBookDto };
      mockBooksService.create.mockResolvedValue(mockBook);

      const result = await controller.create(createBookDto);

      expect(service.create).toHaveBeenCalledWith(createBookDto);
      expect(result).toEqual(mockBook);
    });
  });

  describe('findAll', () => {
    it('should return all books', async () => {
      const mockBooks = [
        { id: '1', title: 'Test Book 1', author: 'Test Author 1' },
        { id: '2', title: 'Test Book 2', author: 'Test Author 2' },
      ];

      mockBooksService.findAll.mockResolvedValue(mockBooks);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockBooks);
    });
  });

  describe('findOne', () => {
    it('should return a book by id', async () => {
      const bookId = '1';
      const mockBook = {
        id: bookId,
        title: 'Test Book',
        author: 'Test Author',
      };

      mockBooksService.findOne.mockResolvedValue(mockBook);

      const result = await controller.findOne(bookId);

      expect(service.findOne).toHaveBeenCalledWith(bookId);
      expect(result).toEqual(mockBook);
    });
  });

  describe('update', () => {
    it('should update a book', async () => {
      const bookId = '1';
      const updateBookDto: UpdateBookDto = { title: 'Updated Test Book' };
      const mockBook = {
        id: bookId,
        title: 'Updated Test Book',
        author: 'Test Author',
      };

      mockBooksService.update.mockResolvedValue(mockBook);

      const result = await controller.update(bookId, updateBookDto);

      expect(service.update).toHaveBeenCalledWith(bookId, updateBookDto);
      expect(result).toEqual(mockBook);
    });
  });

  describe('remove', () => {
    it('should remove a book', async () => {
      const bookId = '1';

      mockBooksService.remove.mockResolvedValue(undefined);

      await controller.remove(bookId);

      expect(service.remove).toHaveBeenCalledWith(bookId);
    });
  });
});
