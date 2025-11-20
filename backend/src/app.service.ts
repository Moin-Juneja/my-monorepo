import { Injectable } from '@nestjs/common';
import { db } from './db';
import { users } from './db/schema';
import { eq } from "drizzle-orm"; // Add this import


@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  getAllUsers() {
    return db.select().from(users);
  }
  createUser(createUserDto: any) {
    return db.insert(users).values(createUserDto);
  }
  updateUser(id: number, updateUserDto: any) {
    return db.update(users)
      .set(updateUserDto)
      .where(eq(users.id, id))
      .returning();
  }
  deleteUser(id: number) {
    return db.delete(users).where(eq(users.id, id));
  }
}
