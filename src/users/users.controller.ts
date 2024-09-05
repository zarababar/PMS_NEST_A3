import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDTO } from './dto/create-user.dto';
import { User } from './user.entity';
@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  createUser(@Body() CreateUserDTO: CreateUserDTO): Promise<User> {
    return this.usersService.createUser(CreateUserDTO);
  }
}
