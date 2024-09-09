import { Controller, Post, UseGuards } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { AuthGuard } from '@nestjs/passport';
import { Category } from './category.entity';

@Controller('categories')
@UseGuards(AuthGuard('jwt'))
export class CategoriesController {
  constructor(private categoryService: CategoriesService) {}

  @Post()
  async createCategories(): Promise<Category[]> {
    return await this.categoryService.createCategories();
  }
}
