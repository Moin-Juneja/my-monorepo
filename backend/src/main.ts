import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { db } from './db';
import { users } from './db/schema';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
   app.enableCors({
    origin: 'http://localhost:5173', // Your Vite frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  });
  const sampleUsers = [
    { name: 'John Doe', email: 'john@example.com' },
    { name: 'Jane Smith', email: 'jane@example.com' },
  ];

  // Check if data already exists
  // const existing = await db.select().from(users);
  // if (existing.length === 0) {
  //   await db.insert(users).values(sampleUsers);
  //   console.log('Sample users inserted into DB!');
  // } else {
  //   console.log('ℹUsers already exist, skipping insert.');
  // }

  await app.listen(3000);
}
bootstrap();
