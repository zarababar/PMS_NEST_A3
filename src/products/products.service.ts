import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { CreateProductsDTO } from './dto/create-product.dto';
import { User } from 'src/users/user.entity';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class ProductsService {
  private readonly productsRepository: ProductsRepository;
  private usersRepository: UsersRepository;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.productsRepository = new ProductsRepository(this.dataSource.manager);
    this.usersRepository = new UsersRepository(this.dataSource.manager);
  }
  async createProduct(
    createProductsDTO: CreateProductsDTO,
    user: User,
  ): Promise<Product> {
    // return await this.productsRepository.createProduct(createProductsDTO, user);
    return await this.dataSource.transaction(
      async (transactionalEntityManager) => {
        // Use the transactionalEntityManager to ensure operations are part of the transaction
        const productsRepo = transactionalEntityManager.getRepository(Product);
        const product = await productsRepo.save(
          productsRepo.create(createProductsDTO),
        );

        // Update the user's product list
        user.products = [...(user.products || []), product];
        const usersRepo = transactionalEntityManager.getRepository(User);
        console.log(user);
        await usersRepo.save(user);

        return product;
      },
    );
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
  async deleteProduct(id: string, user: User): Promise<void> {
    const result = await this.productsRepository.delete({ id, user });
    if (result.affected === 0) {
      throw new NotFoundException(`Product with ${id} not found!`);
    }
  }
  async updateProduct(
    id: string,
    createProductsDTO: CreateProductsDTO,
  ): Promise<Product> {
    const { description, title, price } = createProductsDTO;
    const product = await this.productsRepository.findOne({ where: { id } });

    if (!product) {
      throw new NotFoundException(`Product with ${id} not found!`);
    }
    product.title = title;
    product.description = description;
    product.price = price;
    await this.productsRepository.save(product);
    return product;
  }
}
