import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersRepository } from './users.repository';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }), //work with jwt
    JwtModule.register({
      //export a service -> jwtservice
      secret: 'topSecret',
      signOptions: {
        expiresIn: 3600,
      },
    }),
    TypeOrmModule.forFeature([UsersRepository]),
  ],
  controllers: [UsersController],
  providers: [UsersService, JwtStrategy], //made available to the module
  exports: [JwtStrategy, PassportModule],
  //anyother module which applies this auth module to apply authentication
})
export class UsersModule {}
