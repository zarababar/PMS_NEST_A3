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
import { SeedService } from './seeds/seeds.service';
// import { CategoriesModule } from './categories/categories.module';
import { MulterModule } from '@nestjs/platform-express';
import { UploadController } from './upload/upload.controller';
@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    ProductsModule,
    UsersModule,
    CategoriesModule,
    MulterModule,
  ],

  // controllers: [ProductsController, CategoriesController],
  providers: [SeedService],

  controllers: [UploadController],
})
export class AppModule {}
