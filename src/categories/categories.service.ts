import { Injectable } from '@nestjs/common';
import { CategoryRepository } from './categories.repository';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Category } from './category.entity';

@Injectable()
export class CategoriesService {
  private readonly categoryRepository: CategoryRepository;
  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.categoryRepository = new CategoryRepository(this.dataSource.manager);
  }
  // Create multiple categories
  async createCategories(): Promise<Category[]> {
    // Define your categories
    const categories = [
      { name: 'Mobile' },
      { name: 'Laptops' },
      { name: 'Earphone' },
      { name: 'Tablet' },
    ];

    // Map categories to Category entities
    const categoryEntities = categories.map((cat) => {
      const category = new Category();
      category.name = cat.name;
      return category;
    });

    // Save all categories to the database
    return await this.categoryRepository.save(categoryEntities);
  }
}
