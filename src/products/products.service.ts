import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { CreateProductsDTO } from './dto/create-product.dto';
import { User } from 'src/users/user.entity';
import { UsersRepository } from 'src/users/users.repository';
import { CategoryRepository } from 'src/categories/categories.repository';
import { Category } from 'src/categories/category.entity';

@Injectable()
export class ProductsService {
  private readonly productsRepository: ProductsRepository;
  private usersRepository: UsersRepository;
  private readonly categoryRepository: CategoryRepository;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.productsRepository = new ProductsRepository(this.dataSource.manager);
    this.categoryRepository = new CategoryRepository(this.dataSource.manager);
  }
  async createProduct(
    createProductsDTO: CreateProductsDTO,
    user: User,
  ): Promise<Product> {
    try {
      return await this.dataSource.transaction(
        async (transactionalEntityManager) => {
          // Use Promise.all if you have multiple concurrent operations
          const product = await this.productsRepository.createProduct(
            createProductsDTO,
            user,
            transactionalEntityManager,
          );

          // Ensure the created product is returned correctly
          return product;
        },
      );
    } catch (error) {
      console.error('Error creating product:', error);
      throw new InternalServerErrorException(
        'An error occurred while creating the product.',
      );
    }
  }

  async updateProduct(
    id: string,
    createProductsDTO: CreateProductsDTO,
  ): Promise<Product> {
    try {
      return await this.dataSource.transaction(
        async (transactionalEntityManager) => {
          const {
            description,
            title,
            price,
            category: categoryId,
          } = createProductsDTO;

          // Perform concurrent fetch operations for product and category
          const [product, category] = await Promise.all([
            transactionalEntityManager.findOne(Product, { where: { id } }),
            transactionalEntityManager.findOne(Category, {
              where: { id: categoryId },
            }),
          ]);

          if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found!`);
          }

          if (!category) {
            throw new NotFoundException(
              `Category with ID ${categoryId} not found!`,
            );
          }

          // Update product properties
          product.title = title;
          product.description = description;
          product.price = price;
          product.category = category;

          // Save the updated product
          await transactionalEntityManager.save(Product, product);

          return product;
        },
      );
    } catch (error) {
      throw new InternalServerErrorException(
        error,
        'An error occurred while updating the product.',
      );
    }
  }

  async deleteProduct(id: string, user: User): Promise<void> {
    const result = await this.productsRepository.delete({ id, user });
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ${id} not found!`);
    }
  }

  async getProductInfo(id: string, user: User): Promise<Product> {
    const product = await this.productsRepository.findOne({
      where: { id, user },
    });
    if (!product) {
      throw new NotFoundException(`Product with ${id} not found!`);
    }
    return product;
  }

  async getAllProducts(): Promise<Product[]> {
    const products = await this.productsRepository.find();

    return products;
  }

  async getCategoryProducts(categoryId: string): Promise<Product[]> {
    const categoryProducts = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: ['products'],
    });
    return categoryProducts.products;
  }
  async getUserProducts(userId: string): Promise<Product[]> {
    const userProducts = await this.productsRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    return userProducts;
  }
}
