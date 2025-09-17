import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
}

export const UserSchema = SchemaFactory.createForClass(User);
