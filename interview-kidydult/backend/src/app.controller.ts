import {
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { HelloDTO } from './dto/hello.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { interceptorConfig } from './config/interceptor.config';
import { FileArray } from 'multer';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): HelloDTO {
    return this.appService.getHello();
  }

  @Post()
  @UseInterceptors(FilesInterceptor('files', 100, interceptorConfig))
  receiveFile(@UploadedFiles() files: FileArray): any {
    return this.appService.getHello();
  }
}
