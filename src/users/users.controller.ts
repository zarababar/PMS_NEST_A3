import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.model';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getAllUsers(): User[] {
    return this.usersService.getAllUsers();
  }

  @Post()
  createUser(
    @Body('name') name,
    @Body('email') email,
    @Body('password') password,
  ): User {
    return this.usersService.createUser(name, email, password);
  }
}
