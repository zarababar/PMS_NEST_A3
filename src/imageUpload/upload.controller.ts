import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';

@Controller('upload')
export class UploadController {
  @Post()
  @UseInterceptors(FilesInterceptor('files', 5)) // Accept up to 5 files
  uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>) {
    console.log(files);
    return {
      message: 'Files uploaded successfully!',
      files: files.map((file) => ({
        originalName: file.originalname,
        filename: file.filename,
        path: file.path,
        size: file.size,
      })),
    };
  }
}
