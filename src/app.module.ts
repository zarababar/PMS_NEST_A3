import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
// import { ProductsController } from './products/products.controller';
// import { ProductsService } from './products/products.service';
// import { CategoriesController } from './categories/categories.controller';
// import { CategoriesService } from './categories/categories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './database/orm.config';
import { ProductsModule } from './products/products.module';
import { CategoriesModule } from './categories/categories.module';
// import { CategoriesModule } from './categories/categories.module';
@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    ProductsModule,
    UsersModule,
    CategoriesModule,
  ],
  // controllers: [ProductsController, CategoriesController],
  // providers: [ProductsService, CategoriesService],
})
export class AppModule {}
