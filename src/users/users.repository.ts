// users.repository.ts
import { EntityManager, Repository } from 'typeorm';
import { User } from './user.entity';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { UserDataDTO } from './dto/userData.dto';
import * as bcrypt from 'bcrypt';
// Custom repository class extending the TypeORM Repository
export class UsersRepository extends Repository<User> {
  constructor(manager: EntityManager) {
    super(User, manager); // Passing the entity (User) and the EntityManager instance to the base Repository constructor
  }
  async createUser(userDataDTO: UserDataDTO): Promise<User> {
    const { name, email, password } = userDataDTO;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = this.create({
      name,
      email,
      password: hashedPassword,
    });
    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505') {
        //duplicate email
        throw new ConflictException('Email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
    return user;
  }
}
