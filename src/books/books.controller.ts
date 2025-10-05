import {
  BadRequestException,
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
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import type { AuthenticatedUser } from 'src/auth/decorators/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  create(
    @CurrentUser() user: AuthenticatedUser,
    @Body() dto: CreateBookDto,
  ): Promise<BookResponseDto> {
    return this.booksService.create(dto, user.userId);
  }

  @Public()
  @Get()
  findAll(@Query() query: ListBooksQueryDto) {
    return this.booksService.findAllPaged(
      query.page,
      query.limit,
      query.genres,
    );
  }

  @Public()
  @Get('search')
  search(@Query('q') q: string): Promise<BookResponseDto[]> {
    const normalized = q?.trim();
    if (!normalized) {
      throw new BadRequestException('Query param q is required');
    }

    return this.booksService.searchBooks(normalized);
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
  remove(
    @CurrentUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ): Promise<void> {
    return this.booksService.remove(id, user.userId);
  }
}
