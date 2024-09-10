import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductsDTO {
  // @IsNotEmpty()
  // @IsString()
  title: string;

  // @IsNotEmpty()
  // @IsString()
  description: string;

  @IsNotEmpty()
  // @IsNumber()
  price: number;

  // @IsNotEmpty()
  // @IsUUID('4')
  category: string;
}
