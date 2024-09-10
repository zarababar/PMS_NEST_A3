import {
  ForbiddenException,
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
import { CategoryRepository } from 'src/categories/categories.repository';
import { Category } from 'src/categories/category.entity';

@Injectable()
export class ProductsService {
  private readonly productsRepository: ProductsRepository;
  private readonly categoryRepository: CategoryRepository;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.productsRepository = new ProductsRepository(this.dataSource.manager);
    this.categoryRepository = new CategoryRepository(this.dataSource.manager);
  }
  async createProduct(
    createProductsDTO: CreateProductsDTO,
    user: User,
    images: Array<Express.Multer.File>,
  ): Promise<Product> {
    try {
      return await this.dataSource.transaction(
        async (transactionalEntityManager) => {
          const product = await this.productsRepository.createProduct(
            createProductsDTO,
            user,
            transactionalEntityManager,
            images,
          );

          // Ensure the created product is returned correctly
          return product;
        },
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateProduct(
    id: string,
    user: User,
    createProductsDTO: CreateProductsDTO,
    images: Array<Express.Multer.File>,
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
            transactionalEntityManager.findOne(Product, {
              where: { id },
              relations: ['user'],
            }),
            transactionalEntityManager.findOne(Category, {
              where: { id: categoryId },
            }),
          ]);

          //Check if the current user is the owner of the product
          if (product.user.id !== user.id) {
            throw new ForbiddenException(
              `You do not have permission to update this product!`,
            );
          }
          if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found!`);
          }

          if (!category) {
            throw new NotFoundException(
              `Category with ID ${categoryId} not found!`,
            );
          }

          const imagePaths = images.map((file) => file.path);

          // Update product properties
          product.title = title;
          product.description = description;
          product.price = price;
          product.category = category;
          product.images = imagePaths;

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
    try {
      const product = await this.productsRepository.findOne({
        where: { id },
        relations: ['user'],
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found!`);
      }

      if (product.user.id !== user.id) {
        throw new ForbiddenException(
          `You do not have permission to delete this product!`,
        );
      }

      const result = await this.productsRepository.delete({ id });

      if (result.affected === 0) {
        throw new NotFoundException(`Product with ID ${id} not found!`);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while deleting the product.',
      );
    }
  }

  async getProductInfo(id: string, user: User): Promise<Product> {
    try {
      const product = await this.productsRepository.findOne({
        where: { id, user },
      });

      if (!product) {
        throw new NotFoundException(`Product with ID ${id} not found!`);
      }

      return product;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving the product.',
      );
    }
  }
  async getAllProducts(): Promise<Product[]> {
    try {
      const products = await this.productsRepository.find();
      return products;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving all products.',
      );
    }
  }

  async getCategoryProducts(categoryId: string): Promise<Category> {
    try {
      const categoryProducts = await this.categoryRepository.findOne({
        where: { id: categoryId },
        relations: ['products'],
      });

      if (!categoryProducts) {
        throw new NotFoundException(
          `Category with ID ${categoryId} not found!`,
        );
      }

      return categoryProducts;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving the category products.',
      );
    }
  }
  async getUserProducts(
    loggedInUser: User,
    userId: string,
  ): Promise<Product[]> {
    try {
      if (loggedInUser.id !== userId) {
        throw new ForbiddenException(
          `You do not have permission to access products for user ID ${userId}.`,
        );
      }
      const userProducts = await this.productsRepository.find({
        where: { user: { id: userId } },
        relations: ['user'],
      });

      return userProducts;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving the user products.',
      );
    }
  }
}
