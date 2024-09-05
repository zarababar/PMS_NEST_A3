import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from './products.repository';
import { DataSource } from 'typeorm';
import { InjectDataSource } from '@nestjs/typeorm';
import { Product } from './product.entity';
import { CreateProductsDTO } from './dto/create-product.dto';

@Injectable()
export class ProductsService {
  private readonly productsRepository: ProductsRepository;

  constructor(@InjectDataSource() private readonly dataSource: DataSource) {
    this.productsRepository = new ProductsRepository(this.dataSource.manager);
  }
  async createProduct(createProductsDTO: CreateProductsDTO): Promise<Product> {
    return await this.productsRepository.createProduct(createProductsDTO);
  }

  async getProductInfo(id: string): Promise<Product> {
    const product = await this.productsRepository.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException(`Product with ${id} not found!`);
    }
    return product;
  }

  async getAllProducts(): Promise<Product[]> {
    const products = await this.productsRepository.find();

    return products;
  }
  async deleteProduct(id: string): Promise<void> {
    const result = await this.productsRepository.delete(id);
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
