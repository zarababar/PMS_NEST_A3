import { EntityManager, Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductsDTO } from './dto/create-product.dto';
import { User } from 'src/users/user.entity';
import { Category } from 'src/categories/category.entity';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export class ProductsRepository extends Repository<Product> {
  constructor(manager: EntityManager) {
    super(Product, manager);
  }

  async createProduct(
    createProductsDTO: CreateProductsDTO,
    user: User,
    transactionalEntityManager: EntityManager,
  ): Promise<Product> {
    try {
      const { title, description, price, category } = createProductsDTO;

      // Fetch the category from the database
      const categoryData = await transactionalEntityManager.findOne(Category, {
        where: { id: category },
      });

      if (!categoryData) {
        throw new NotFoundException(`Category with ID ${category} not found`);
      }

      // Create the product entity
      const product = transactionalEntityManager.create(Product, {
        title,
        description,
        price,
        user,
        category: categoryData,
      });

      // Save the product entity
      await transactionalEntityManager.save(product);

      return product;
    } catch (error) {
      throw new InternalServerErrorException(
        `Failed to create product: ${error.message}`,
      );
    }
  }
}
