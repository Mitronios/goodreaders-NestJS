import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BooksService } from './books.service';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { BookResponseDto } from './dto/book-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { ListBooksQueryDto } from './dto/list-books.query';

@UseGuards(JwtAuthGuard)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(@Body() dto: CreateBookDto): Promise<BookResponseDto> {
    return this.booksService.create(dto);
  }

  @Public()
  @Get()
  findAll(@Query() query: ListBooksQueryDto) {
    return this.booksService.findAllPaged(query.page, query.limit);
  }

  @Public()
  @Get('search')
  search(@Query('q') q: string): Promise<BookResponseDto[]> {
    return this.booksService.searchBooks(q);
  }

  @Get('genres')
  getAllGenres(): Promise<string[]> {
    return this.booksService.getAllGenres();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<BookResponseDto> {
    return this.booksService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateBookDto,
  ): Promise<BookResponseDto> {
    return this.booksService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.booksService.remove(id);
  }
}
