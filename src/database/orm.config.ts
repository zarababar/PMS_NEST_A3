import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Category } from 'src/categories/category.entity';
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
  entities: [Product, User, Category],
  autoLoadEntities: true,
};
// import 'reflect-metadata';
// import { DataSource } from 'typeorm';
// import { Category } from '../categories/category.entity';
// import { Product } from '../products/product.entity';
// import { User } from '../users/user.entity';

// // Configure your data source
// export const AppDataSource = new DataSource({
//   type: 'postgres',
//   host: '127.0.0.1',
//   port: 5432,
//   username: 'postgres',
//   password: '123456',
//   database: 'PMS_db',
//   synchronize: true,
//   entities: [Category, Product, User],
// });

// // Define your seed data
// const categories = [
//   { name: 'Mobile' },
//   { name: 'Laptops' },
//   { name: 'Earphone' },
//   { name: 'Tablet' },
// ];

// // Seeder function
// const seed = async () => {
//   try {
//     // Initialize the data source
//     await AppDataSource.initialize();

//     // Get the category repository
//     const categoryRepository = AppDataSource.getRepository(Category);

//     // Create and save categories
//     for (const category of categories) {
//       const newCategory = categoryRepository.create(category);
//       await categoryRepository.save(newCategory);
//     }

//     console.log('Categories seeded successfully.');
//   } catch (error) {
//     console.error('Error seeding database:', error);
//   } finally {
//     // Close the connection
//     await AppDataSource.destroy();
//   }
// };

// // Run the seeder
// seed();
