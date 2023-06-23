import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { multerConfig } from './config/multer.config';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [MulterModule.register(multerConfig)],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
