import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Category } from 'src/categories/category.entity';
import { Product } from 'src/products/product.entity';
import { User } from 'src/users/user.entity';

import * as dotenv from 'dotenv';
dotenv.config();

export const config: TypeOrmModuleOptions = {
  type: 'postgres',
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  port: +process.env.DATABASE_PORT,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_NAME,
  synchronize: true, //add new fields in the table auto
  entities: [Product, User, Category],
  autoLoadEntities: true,
};
