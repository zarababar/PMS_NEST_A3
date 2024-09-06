import { EntityManager, Repository } from 'typeorm';
import { Product } from './product.entity';
import { CreateProductsDTO } from './dto/create-product.dto';
import { User } from 'src/users/user.entity';

export class ProductsRepository extends Repository<Product> {
  constructor(manager: EntityManager) {
    super(Product, manager);
  }

  async createProduct(
    createProductsDTO: CreateProductsDTO,
    user: User,
    entityManager: EntityManager,
  ): Promise<Product> {
    try {
      const { title, description, price } = createProductsDTO;
      const product = this.create({
        title,
        description,
        price,
        user,
      });
      // await this.save(product);
      await entityManager.save(product);
      return product;
    } catch (error) {
      // Log the error or handle it as needed
      throw new Error(`Failed to create product: ${error.message}`);
    }
  }
}
