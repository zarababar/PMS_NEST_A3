import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Category } from 'src/categories/category.entity';
@Injectable()
export class SeedService {
  constructor(private readonly dataSource: DataSource) {}

  async seed() {
    await this.seedCategories();
  }

  private async seedCategories() {
    const categoryRepository = this.dataSource.getRepository(Category);

    // Define your categories
    const categories = [
      { name: 'Mobile' },
      { name: 'Laptops' },
      { name: 'Earphone' },
      { name: 'Tablet' },
    ];

    // Check if categories already exist to prevent duplicates
    for (const cat of categories) {
      const existingCategory = await categoryRepository.findOneBy({
        name: cat.name,
      });
      if (!existingCategory) {
        const category = new Category();
        category.name = cat.name;
        await categoryRepository.save(category);
        console.log(`Category ${cat.name} has been added.`);
      } else {
        console.log(`Category ${cat.name} already exists.`);
      }
    }

    console.log('Categories seeding completed.');
  }
}
