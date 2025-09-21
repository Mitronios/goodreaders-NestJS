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

  async create(dto: CreateBookDto): Promise<BookDocument> {
    return this.bookModel.create(dto);
  }

  async findAll(): Promise<BookDocument[]> {
    return this.bookModel.find().exec();
  }

  async findOne(id: string): Promise<BookDocument> {
    const book = await this.bookModel.findById(id).exec();
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async update(id: string, dto: UpdateBookDto): Promise<BookDocument> {
    const book = await this.bookModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!book) throw new NotFoundException('Book not found');
    return book;
  }

  async remove(id: string): Promise<void> {
    const res = await this.bookModel.deleteOne({ id: id });
    if (res.deletedCount === 0) throw new NotFoundException('Book not found');
  }

  async markWantToRead(id: string): Promise<BookDocument> {
    const book = await this.bookModel.findById(id);
    if (!book) throw new NotFoundException('Book not found');
    book.wantToRead = true;
    await book.save();
    return book;
  }
}
