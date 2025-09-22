import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Book.name) private readonly bookModel: Model<BookDocument>,
  ) {}

  /* Mapper: _id → id */
  private toFrontend(book: BookDocument) {
    const obj = book.toObject({ virtuals: false });
    return {
      id: obj._id.toString(),
      title: obj.title,
      author: obj.author,
      description: obj.description,
      review: obj.review,
      cover: obj.cover,
      genre: obj.genre,
      rating: obj.rating,
      createdAt: obj.createdAt,
      updatedAt: obj.updatedAt,
    };
  }

  /* CRUD usando el mapper */

  async create(dto: CreateBookDto) {
    const book = await this.bookModel.create(dto);
    return this.toFrontend(book);
  }

  async findAll() {
    const books = await this.bookModel.find().exec();
    return books.map(b => this.toFrontend(b));
  }

  async findOne(id: string) {
    const book = await this.bookModel.findById(id).exec();
    if (!book) throw new NotFoundException('Book not found');
    return this.toFrontend(book);
  }

  async update(id: string, dto: UpdateBookDto) {
    const book = await this.bookModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!book) throw new NotFoundException('Book not found');
    return this.toFrontend(book);
  }

  async remove(id: string) {
    const res = await this.bookModel.deleteOne({ _id: id });
    if (res.deletedCount === 0) throw new NotFoundException('Book not found');
  }
}
