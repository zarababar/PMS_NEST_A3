import { Injectable } from '@nestjs/common';
import { User } from './users.model';
import { v4 as uuid } from 'uuid';

@Injectable()
export class UsersService {
  private users: User[] = [];

  getAllUsers(): User[] {
    return this.users;
  }
  createUser(CreateTaskDTO): User {
    const { name, email, password } = CreateTaskDTO;
    const user: User = {
      id: uuid(),
      name,
      email,
      password,
      //confirmPassword
    };
    this.users.push(user);

    return user;
  }
}
