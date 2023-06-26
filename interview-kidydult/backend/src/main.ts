import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  dotenv.config();
  console.log('Frontend URL for CORS:', process.env.CLIENT_URL);
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: [process.env.CLIENT_URL],
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
      credentials: true,
    },
  });
  await app.listen(4000);
  console.log('Server running at http://localhost:4000');
}
bootstrap();
