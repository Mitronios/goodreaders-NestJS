import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class UserBook {
  @Prop({ required: true, trim: true })
  bookId: string;

  @Prop({ required: true, default: true })
  wantToRead: boolean;
}

export const UserBookSchema = SchemaFactory.createForClass(UserBook);

@Schema({ timestamps: true })
export class User extends Document {
  @Prop({ required: true, trim: true, minlength: 2, maxlength: 50 })
  name: string;

  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false, trim: true })
  avatar?: string;

  @Prop({ required: false, default: 'user' })
  role: string;

  @Prop({ type: [UserBookSchema], default: [] })
  books: UserBook[];


}

export const UserSchema = SchemaFactory.createForClass(User);

// Deduplicate books at persistence time to keep a single entry per bookId.
UserSchema.pre('save', function (next) {
  const userDocument = this as User;

  if (!Array.isArray(userDocument.books)) {
    userDocument.books = [];
    return next();
  }

  const uniqueBooks = new Map<string, UserBook>();

  for (const entry of userDocument.books) {
    if (!entry || typeof entry.bookId !== 'string') {
      continue;
    }

    const trimmedId = entry.bookId.trim();
    if (!trimmedId) {
      continue;
    }

    uniqueBooks.set(trimmedId, {
      bookId: trimmedId,
      wantToRead: Boolean(entry.wantToRead),
    });
  }

  userDocument.books = Array.from(uniqueBooks.values());

  next();
});
