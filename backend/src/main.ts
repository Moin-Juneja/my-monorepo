import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { db } from './db';
import { users } from './db/schema';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   app.enableCors({
    origin: 'http://localhost:4173', // Your Vite frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });

  await app.listen(4000);
}
bootstrap();
