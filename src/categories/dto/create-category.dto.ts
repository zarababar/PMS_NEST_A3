import { IsNotEmpty, IsString } from 'class-validator';

export class createCategoryDTO {
  @IsNotEmpty()
  @IsString()
  name: string;
}
