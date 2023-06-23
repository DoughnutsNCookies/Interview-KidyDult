import {
  Body,
  Controller,
  Get,
  Post,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import { interceptorConfig } from './config/interceptor.config';
import { FileArray } from 'multer';
import { FormDataDTO, UserDTO } from './dto/app.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('all')
  @UseInterceptors(FilesInterceptor('file', 100, interceptorConfig))
  generateOutputForAll(
    @UploadedFiles() files: FileArray,
    @Body() formData: FormDataDTO,
  ): Promise<UserDTO[]> {
    const filePaths: string[] = files.map((file) => file.path);
    return this.appService.generateOutputForAll(filePaths, formData);
  }

  @Post('per')
  @UseInterceptors(FilesInterceptor('file', 100, interceptorConfig))
  generateOutputForPer(
    @UploadedFiles() files: FileArray,
    @Body() formData: FormDataDTO,
  ): Promise<UserDTO[][]> {
    const filePaths: string[] = files.map((file) => file.path);
    return this.appService.generateOutputForPer(filePaths, formData);
  }
}
