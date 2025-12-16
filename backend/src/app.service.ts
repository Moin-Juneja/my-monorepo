import { Injectable } from '@nestjs/common';
import { db } from './db';
import { users } from './db/schema';
import { eq } from 'drizzle-orm';

// Define a User type matching your schema
export interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getAllUsers(): Promise<User[]> {
    return db.select().from(users);
  }

  createUser(createUserDto: { name: string; email: string }): Promise<User[]> {
    return db.insert(users).values(createUserDto).returning();
  }

  updateUser(id: number, updateUserDto: Partial<{ name: string; email: string }>): Promise<User[]> {
    return db.update(users).set(updateUserDto).where(eq(users.id, id)).returning();
  }

  deleteUser(id: number): Promise<void> {
    return db.delete(users).where(eq(users.id, id));
  }
}
