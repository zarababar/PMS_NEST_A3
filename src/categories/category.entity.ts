import { Product } from 'src/products/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('categroies')
export class Category {
  @PrimaryGeneratedColumn('uuid') //automatically generate PK id
  id: string;

  @Column()
  name: string;

  //One category can have many products ()=>Product
  //relationship with category is the secind arg
  @OneToMany(() => Product, (product) => product.category, { eager: true })
  products: Product[];
}
