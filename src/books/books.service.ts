import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookResponseDto } from './dto/book-response.dto';
import { BookResponseMapper } from './mappers/book-response.mapper';
import { SearchUtil } from './utils/search.util';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<BookDocument>,
  ) {}

  async findAllPaged(
    page: number,
    limit: number,
    genres: string[] = [],
  ): Promise<{
    items: BookResponseDto[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    const skip = (page - 1) * limit;

    const [docs, total] = await Promise.all([
      this.bookModel.find().skip(skip).limit(limit).exec(),
      this.bookModel.countDocuments().exec(),
    ]);

    return {
      items: BookResponseMapper.toResponseArray(docs),
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async create(
    dto: CreateBookDto,
    createdBy: string,
  ): Promise<BookResponseDto> {
    const book = await this.bookModel.create({ ...dto, createdBy });
    return BookResponseMapper.toResponse(book);
  }

  async findOne(id: string): Promise<BookResponseDto> {
    const book = await this.bookModel.findById(id).exec();
    if (!book) throw new NotFoundException('Book not found');
    return BookResponseMapper.toResponse(book);
  }

  async update(id: string, dto: UpdateBookDto): Promise<BookResponseDto> {
    const book = await this.bookModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!book) throw new NotFoundException('Book not found');
    return BookResponseMapper.toResponse(book);
  }

  async remove(id: string, userId: string): Promise<void> {
    const book = await this.bookModel.findById(id).exec();
    if (!book) throw new NotFoundException('Book not found');

    if (book.createdBy !== userId) {
      throw new ForbiddenException('You cannot delete this book');
    }

    const res = await this.bookModel.deleteOne({ _id: id });
    if (res.deletedCount === 0) throw new NotFoundException('Book not found');
  }

  /* Get all available genres */

  async getAllGenres(): Promise<string[]> {
    return this.bookModel.distinct('genre');
  }

  async searchBooks(query: string): Promise<BookResponseDto[]> {
    const regex = SearchUtil.buildSearchRegex(query);
    if (!regex) return [];

    const books = await this.bookModel
      .find({
        $or: [{ title: regex }, { author: regex }],
      })
      .exec();
    return BookResponseMapper.toResponseArray(books);
  }
}
