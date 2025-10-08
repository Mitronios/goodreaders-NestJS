import { BookInput } from '../interfaces/book-input.interface';
import { convertIdToString } from '../utils/id-converter.util';

export class BookResponseDto {
  id: string;
  title: string;
  author: string;
  description?: string;
  review: string;
  cover?: string;
  genre: string[];
  rating: number;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(book: BookInput) {
    this.id = convertIdToString(book._id, book.id);
    this.title = book.title ?? '';
    this.author = book.author ?? '';
    this.description = book.description;
    this.review = book.review ?? '';
    this.cover = book.cover;
    this.genre = book.genre ?? [];
    this.rating = book.rating ?? 0;
    this.createdBy = book.createdBy ?? '';
    this.createdAt = book.createdAt ?? new Date();
    this.updatedAt = book.updatedAt ?? new Date();
  }

  static fromBook(book: BookInput): BookResponseDto {
    return new BookResponseDto(book);
  }
}
