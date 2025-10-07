import { Injectable } from '@nestjs/common';
import type { Express } from 'express';

export interface FileUploadResult {
  filename: string;
  path: string;
}

@Injectable()
export class FileUploadService {
  /**
   * Processes uploaded file and returns file information
   */
  processAvatarUpload(
    file: Express.Multer.File | undefined,
  ): FileUploadResult | null {
    if (!file) {
      return null;
    }

    return {
      filename: file.filename,
      path: `/uploads/avatars/${file.filename}`,
    };
  }

  /**
   * Validates if file is a valid image
   */
  validateImageFile(file: Express.Multer.File): boolean {
    const allowedMimeTypes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
    ];
    return allowedMimeTypes.includes(file.mimetype);
  }

  /**
   * Gets file size in MB
   */
  getFileSizeInMB(file: Express.Multer.File): number {
    return file.size / (1024 * 1024);
  }
}
