// users.repository.ts
import { EntityManager, Repository } from 'typeorm';
import { User } from './user.entity';

// Custom repository class extending the TypeORM Repository
export class UsersRepository extends Repository<User> {
  constructor(manager: EntityManager) {
    super(User, manager); // Passing the entity (User) and the EntityManager instance to the base Repository constructor
  }
  async createUser(CreateUserDTO): Promise<User> {
    const { name, email, password } = CreateUserDTO;
    const user = this.create({
      name,
      email,
      password,
    });
    await this.save(user);
    return user;
  }
}
