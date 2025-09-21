import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Book {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  author: string;

  @Prop()
  description?: string;

  @Prop({ required: true })
  review: string;

  @Prop()
  cover?: string;

  @Prop({ type: [String], default: [] })
  genre: string[];

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;
}

export interface BookDocument extends Book, Document {
  createdAt: Date;
  updatedAt: Date;
}
export const BookSchema = SchemaFactory.createForClass(Book);
