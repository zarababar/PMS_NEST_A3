import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsRepository } from './products.repository';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProductsRepository]), UsersModule],
  controllers: [ProductsController],
  providers: [ProductsService],
})
export class ProductsModule {}
