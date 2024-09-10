import { EntityManager, Repository } from 'typeorm';
import { Category } from './category.entity';

export class CategoryRepository extends Repository<Category> {
  constructor(manager: EntityManager) {
    super(Category, manager);
  }
}
