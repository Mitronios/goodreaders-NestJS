import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';
import { UserCreationService } from './services/user-creation.service';
import { UserDataTransformer } from './services/user-data-transformer.service';
import { FileUploadService } from './services/file-upload.service';
import * as fs from 'fs';
import * as path from 'path';

function ensureUploadsDir() {
  const dir = path.join(__dirname, '../../uploads');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

ensureUploadsDir();

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MulterModule.register({ dest: './uploads' }), // Folder to store avatars
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    UserCreationService,
    UserDataTransformer,
    FileUploadService,
  ],
  exports: [UsersService],
})
export class UsersModule {}
