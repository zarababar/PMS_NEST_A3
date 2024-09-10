import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductsDTO } from './dto/create-product.dto';
import { Product } from './product.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/users/get-user.decorator';
import { User } from 'src/users/user.entity';
import { Category } from 'src/categories/category.entity';

@Controller('products')
@UseGuards(AuthGuard()) //route protecting
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @Post()
  async createProduct(
    @Body() createProductsDTO: CreateProductsDTO,
    @GetUser() user: User, //access user obj from custom decorator
  ): Promise<Product> {
    return await this.productService.createProduct(createProductsDTO, user);
  }

  @Get('/:id')
  async getProductInfo(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Product> {
    return await this.productService.getProductInfo(id, user);
  }

  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }
  @Delete('/:id')
  async deleteProduct(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<void> {
    return this.productService.deleteProduct(id, user);
  }
  @Patch('/:id/product')
  async updateProduct(
    @Param('id') id: string,
    @GetUser() user: User,
    @Body() createProductsDTO: CreateProductsDTO,
  ): Promise<Product> {
    console.log('DTO received:', createProductsDTO);
    return this.productService.updateProduct(id, user, createProductsDTO);
  }

  @Get('/category/:id')
  async getCategoryProducts(
    @Param('id') categoryId: string,
  ): Promise<Category> {
    return this.productService.getCategoryProducts(categoryId);
  }
  @Get('/user/:id')
  async getUserProducts(@Param('id') userId: string): Promise<Product[]> {
    return this.productService.getUserProducts(userId);
  }
}
