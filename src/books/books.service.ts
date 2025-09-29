import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookResponseDto } from './dto/book-response.dto';
import { BookResponseMapper } from './mappers/book-response.mapper';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<BookDocument>,
  ) {}

  /* CRUD using BookResponseDto */

  async create(dto: CreateBookDto): Promise<BookResponseDto> {
    const book = await this.bookModel.create(dto);
    return BookResponseMapper.toResponse(book);
  }

  async findAll(): Promise<BookResponseDto[]> {
    const books = await this.bookModel.find().exec();
    return BookResponseMapper.toResponseArray(books);
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

  async remove(id: string) {
    const res = await this.bookModel.deleteOne({ _id: id });
    if (res.deletedCount === 0) throw new NotFoundException('Book not found');
  }

  /* Get all available genres */

  async getAllGenres(): Promise<string[]> {
    return this.bookModel.distinct('genre');
  }

  /* Open search bar */

  async searchBooks(query: string): Promise<BookResponseDto[]> {
    if (!query?.trim()) return []
    const regex = new RegExp(query.trim(), 'i')
    const books = await this.bookModel.find({
      $or: [
        {title: regex},
        {author: regex},
      ]
    }).exec()
    return BookResponseMapper.toResponseArray(books)
  }
}
