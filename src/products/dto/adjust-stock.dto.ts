import { Type } from 'class-transformer';
import { IsInt, IsNotEmpty, IsString } from 'class-validator';

export class AdjustStockDto {
  @Type(() => Number)
  @IsInt()
  delta: number;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
