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
import { CustomFilesInterceptor } from 'src/imageUpload/images.interceptor';

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
  @Delete('/:id')
  async deleteProduct(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<void> {
    try {
      await this.productService.deleteProduct(id, user);
    } catch (error) {
      if (
        error instanceof ForbiddenException ||
        error instanceof NotFoundException
      ) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while deleting the product.',
      );
    }
  }

  @Get('/:id')
  async getProductInfo(
    @Param('id') id: string,
    @GetUser() user: User,
  ): Promise<Product> {
    try {
      return await this.productService.getProductInfo(id, user);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while retrieving the product information.',
      );
    }
  }

  @Get()
  async getAllProducts(): Promise<Product[]> {
    try {
      return await this.productService.getAllProducts();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new InternalServerErrorException(
        'An error occurred while retrieving all products.',
      );
    }
  }

  @Get('/category/:id')
  async getCategoryProducts(
    @Param('id') categoryId: string,
  ): Promise<Category> {
    try {
      return await this.productService.getCategoryProducts(categoryId);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while retrieving the category products.',
      );
    }
  }

  @Get('/user/:id')
  async getUserProducts(
    @GetUser() loggedInUser: User,
    @Param('id') userId: string,
  ): Promise<Product[]> {
    try {
      return await this.productService.getUserProducts(loggedInUser, userId);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException(
        'An error occurred while retrieving the user products.',
      );
    }
  }
}
