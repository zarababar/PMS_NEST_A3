import { Product } from 'src/products/product.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user')
export class User {
  @PrimaryGeneratedColumn('uuid') //automatically generate PK id
  id: string;

  @Column()
  name: string;

  @Column({ unique: true }) //email must be unique
  email: string;

  @Column()
  password: string;

  //first arg type and second is how to use it on the pther side of the relation
  //eager: true is whenever fetch data from db, products auto fetched too
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @OneToMany((_type) => Product, (product) => product.user, { eager: true })
  products: Product[];
}
