import { Exclude } from 'class-transformer';
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

  @Column('decimal')
  price: number;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  @ManyToOne((_type) => User, (user) => user.products, { eager: false })
  @Exclude({ toPlainOnly: true }) //json
  user: User;
}
