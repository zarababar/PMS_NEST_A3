import { Injectable } from '@nestjs/common';
import { User } from './users.model';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UsersService {
  private users: User[] = [];

  getAllUsers(): User[] {
    return this.users;
  }
  createUser(name: string, email: string, password: string): User {
    const user: User = {
      id: uuid(),
      name,
      email,
      password,
    };
    this.users.push(user);

    return user;
  }
}
