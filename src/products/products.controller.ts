import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductsDTO } from './dto/create-product.dto';
import { Product } from './product.entity';

@Controller('products')
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @Post()
  async createProduct(
    @Body() createProductsDTO: CreateProductsDTO,
  ): Promise<Product> {
    return await this.productService.createProduct(createProductsDTO);
  }

  @Get('/:id')
  async getProductInfo(@Param('id') id: string): Promise<Product> {
    return await this.productService.getProductInfo(id);
  }

  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }
  @Delete('/:id')
  async deleteProduct(@Param('id') id: string): Promise<void> {
    return this.productService.deleteProduct(id);
  }
  @Patch('/:id/product')
  async updateProduct(
    @Param('id') id: string,
    @Body() createProductsDTO: CreateProductsDTO,
  ): Promise<Product> {
    return this.productService.updateProduct(id, createProductsDTO);
  }
}
