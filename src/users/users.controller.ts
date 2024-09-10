import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { UserDataDTO } from './dto/userData.dto';
import { User } from './user.entity';
import { GetUser } from './get-user.decorator';
import { AuthGuard } from '@nestjs/passport';
@Controller('auth')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  async signUp(@Body() userDataDTO: UserDataDTO): Promise<User> {
    return this.usersService.signUp(userDataDTO);
  }
  @Post('/signin')
  async signin(
    @Body() authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    return this.usersService.signin(authCredentialsDTO);
  }
  @UseGuards(AuthGuard())
  @Get('/users/products')
  async getUsersProducts(@GetUser() user: User): Promise<User> {
    const userPoducts = await this.usersService.getUsersProducts(user.id);
    return userPoducts;
  }
}
