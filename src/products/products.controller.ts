import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductsDTO } from './dto/create-product.dto';
import { Product } from './product.entity';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/users/get-user.decorator';
import { User } from 'src/users/user.entity';
import { Category } from 'src/categories/category.entity';
import { CustomFilesInterceptor } from 'src/upload/images.interceptor';

@Controller('products')
@UseGuards(AuthGuard()) //route protecting
export class ProductsController {
  constructor(private productService: ProductsService) {}

  @Post()
  @UseInterceptors(CustomFilesInterceptor.createInterceptor('images', 5))
  async createProduct(
    @Body() createProductsDTO: CreateProductsDTO,
    @UploadedFiles() images: Array<Express.Multer.File>,
    @GetUser() user: User, //access user obj from custom decorator
  ): Promise<Product> {
    try {
      return await this.productService.createProduct(
        createProductsDTO,
        user,
        images,
      );
    } catch (error) {
      // Handle specific exceptions
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(error.message);
      } else {
        // For any other types of errors
        throw new InternalServerErrorException('An unexpected error occurred.');
      }
    }
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
  @UseInterceptors(CustomFilesInterceptor.createInterceptor('images', 5))
  async updateProduct(
    @Param('id') id: string,
    @UploadedFiles() images: Array<Express.Multer.File>,
    @GetUser() user: User,
    @Body() createProductsDTO: CreateProductsDTO,
  ): Promise<Product> {
    try {
      return await this.productService.updateProduct(
        id,
        user,
        createProductsDTO,
        images,
      );
    } catch (error) {
      // Handle specific exceptions
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      } else if (error instanceof ForbiddenException) {
        throw new ForbiddenException(error.message);
      } else if (error instanceof InternalServerErrorException) {
        throw new InternalServerErrorException(error.message);
      } else {
        // For any other types of errors
        throw new InternalServerErrorException('An unexpected error occurred.');
      }
    }
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
