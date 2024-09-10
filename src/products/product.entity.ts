import { Exclude } from 'class-transformer';
import { Category } from 'src/categories/category.entity';
import { User } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn('uuid') //automatically generate PK id
  id: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  price: number;

  @Column('simple-array', { nullable: true }) // Use an array type to store multiple image paths
  images: string[];

  @ManyToOne(() => Category, (category) => category.products, { eager: false })
  @Exclude({ toPlainOnly: true })
  category: Category;

  @ManyToOne(() => User, (user) => user.products, { eager: false })
  @Exclude({ toPlainOnly: true }) //json
  user: User;
}
