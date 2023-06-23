import { Controller, Get, Post, UseInterceptors } from '@nestjs/common';
import { AppService } from './app.service';
import { HelloDTO } from './dto/hello.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { interceptorConfig } from './config/interceptor.config';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): HelloDTO {
	return this.appService.getHello();
	}
	
	@Post()
	@UseInterceptors(FileInterceptor('image', interceptorConfig))
	receiveFile(): any {
		return this.appService.getHello();
	}
	
}
