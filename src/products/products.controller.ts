import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';
import { UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

 @UseGuards(JwtAuthGuard)
  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/stock-movements')
  getStockMovements(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getStockMovements(id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

@UseGuards(JwtAuthGuard)
@Post()
create(@Body() dto: CreateProductDto, @Req() req: any) {
  return this.productsService.create(dto, req.user.id);
}

@UseGuards(JwtAuthGuard)
@Put(':id')
update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
  return this.productsService.update(id, dto);
}

@UseGuards(JwtAuthGuard)
@Delete(':id')
remove(@Param('id', ParseIntPipe) id: number) {
  return this.productsService.remove(id);
}

@UseGuards(JwtAuthGuard)
@Patch(':id/stock')
adjustStock(
  @Param('id', ParseIntPipe) id: number,
  @Body() dto: AdjustStockDto,
  @Req() req: any,
) {
  return this.productsService.adjustStock(id, dto, req.user.id);
}
}
