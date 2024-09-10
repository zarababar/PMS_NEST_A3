import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersRepository } from './users.repository';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PassportStrategy } from '@nestjs/passport';
import { User } from './user.entity';
import { JwtPayload } from './jwt-payload.interface';
import * as dotenv from 'dotenv';

dotenv.config();
//injectable class
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private usersRepository: UsersRepository;
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    super({
      secretOrKey: process.env.JWT_SECRET_KEY, //tells the passport-jwt strategy which secret key to use to validate the JWT signature
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), //brearer token
    });
    this.usersRepository = new UsersRepository(this.dataSource.manager);
  }

  async validate(payload: JwtPayload) {
    const { userId } = payload;

    const user: User = await this.usersRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException();
    }
    return user; //attached to the req and always have access to user obj
  }
}
