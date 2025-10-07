import { BookDocument } from '../schemas/book.schema';
import { BookResponseDto } from '../dto/book-response.dto';
import { BookInput } from '../interfaces/book-input.interface';

export class BookResponseMapper {
  static toResponse(book: BookDocument): BookResponseDto {
    const bookObject = book.toObject({virtuals: true})
    return BookResponseDto.fromBook(bookObject as BookInput);
  }

  static toResponseArray(books: BookDocument[]): BookResponseDto[] {
    return books.map(book => this.toResponse(book));
  }
}
