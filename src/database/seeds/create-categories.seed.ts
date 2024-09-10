// src/database/seeds/create-categories.seed.ts
import { Seeder } from 'typeorm-extension';
import { DataSource } from 'typeorm';
import { Category } from 'src/categories/category.entity';
export default class CreateCategories implements Seeder {
  async run(dataSource: DataSource): Promise<void> {
    const categoryRepository = dataSource.getRepository(Category);

    const categories = [
      { name: 'Mobile', products: [] },
      { name: 'Laptops', products: [] },
      { name: 'Earphone', products: [] },
      { name: 'Tablet', products: [] },
    ];

    await categoryRepository.save(categories);
  }
}
