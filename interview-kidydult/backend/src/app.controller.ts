import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { HelloDTO } from './dto/hello.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): HelloDTO {
    return this.appService.getHello();
  }
}
