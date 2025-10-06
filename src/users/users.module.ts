import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { User, UserSchema } from './schemas/user.schema';
import * as fs from 'fs';
import * as path from 'path';

// Utility to ensure 'uploads' directory exists before Multer tries to use it
function ensureUploadsDir() {
  const dir = path.join(__dirname, '../../uploads');
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Call the utility before starting the module
ensureUploadsDir();

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MulterModule.register({ dest: './uploads' }), // Folder to store avatars
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
