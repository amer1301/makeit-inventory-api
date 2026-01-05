import { Type } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsPositive,
  IsString,
  IsUrl,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(120)
  name: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(5)
  @MaxLength(2000)
  description: string;

  @Type(() => Number)
  @IsPositive()
  price: number;

  @IsString()
  @IsNotEmpty()
  @IsUrl({ require_tld: false })
  imageUrl: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stockQuantity?: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  sku: string;

  @Type(() => Number)
  @IsInt()
  categoryId: number;
}
