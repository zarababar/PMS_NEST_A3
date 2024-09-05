import { Injectable, NotFoundException } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { InjectDataSource } from '@nestjs/typeorm';
import { User } from './user.entity';
import { DataSource } from 'typeorm';
@Injectable()
export class UsersService {
  private readonly usersRepository: UsersRepository;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.usersRepository = new UsersRepository(this.dataSource.manager);
  }
  async getUserById(id: string): Promise<User> {
    const found = await this.usersRepository.findOne({ where: { id } });
    if (!found) {
      throw new NotFoundException();
    }
    return found;
  }
  createUser(CreateUserDTO): Promise<User> {
    return this.usersRepository.createUser(CreateUserDTO);
  }
}
