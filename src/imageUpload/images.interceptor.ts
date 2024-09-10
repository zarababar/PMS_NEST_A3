import { Injectable } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { multerConfig } from './multer.config';

@Injectable()
export class CustomFilesInterceptor {
  static createInterceptor(fieldName: string, maxCount?: number) {
    return FilesInterceptor(fieldName, maxCount, multerConfig);
  }
}
