import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { InjectDataSource } from '@nestjs/typeorm';
import { User } from './user.entity';
import { DataSource } from 'typeorm';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { UserDataDTO } from './dto/userData.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';
@Injectable()
export class UsersService {
  private readonly usersRepository: UsersRepository;

  constructor(
    @InjectDataSource() private readonly dataSource: DataSource,
    private jwtService: JwtService,
  ) {
    this.usersRepository = new UsersRepository(this.dataSource.manager);
  }
  async getUserById(id: string): Promise<User> {
    const found = await this.usersRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }
  async signUp(userDataDTO: UserDataDTO): Promise<User> {
    return this.usersRepository.createUser(userDataDTO);
  }
  async signin(
    authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    const { email, password } = authCredentialsDTO;
    const user = await this.usersRepository.findOne({ where: { email } });
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { userId: user.id };
      const accessToken: string = await this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}
