import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { UserDataDTO } from './dto/userData.dto';
import { User } from './user.entity';
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
}
