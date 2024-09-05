import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid') //automatically generate PK id
  id: string;

  @Column()
  name: string;

  // @Column()
  // products: string;
}
