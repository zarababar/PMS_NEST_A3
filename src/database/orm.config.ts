import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Product } from 'src/products/product.entity';
import { User } from 'src/users/user.entity';
export const config: TypeOrmModuleOptions = {
  type: 'postgres',
  username: 'postgres',
  password: '123456',
  port: 5432,
  host: '127.0.0.1',
  database: 'PMS_db',
  synchronize: true, //add new fields in the table auto
  entities: [Product, User],
  autoLoadEntities: true,
};
