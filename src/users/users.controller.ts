import { Body, Controller, Get, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './users.model';
import { CreateTaskDTO } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get()
  getAllUsers(): User[] {
    return this.usersService.getAllUsers();
  }

  @Post()
  createUser(@Body() CreateTaskDTO: CreateTaskDTO): User {
    return this.usersService.createUser(CreateTaskDTO);
  }

  //   @Delete()
}
