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
  Req,
  UseGuards,
} from '@nestjs/common';

import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('products')
@UseGuards(JwtAuthGuard, RolesGuard) // ✅ skyddar alla routes + roller
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // ✅ STAFF + ADMIN: läsa produkter
  @Get()
  @Roles('ADMIN', 'STAFF')
  findAll() {
    return this.productsService.findAll();
  }

  // ✅ STAFF + ADMIN: se lagerhistorik
  @Get(':id/stock-movements')
  @Roles('ADMIN', 'STAFF')
  getStockMovements(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.getStockMovements(id);
  }

  // ✅ STAFF + ADMIN: läsa en produkt
  @Get(':id')
  @Roles('ADMIN', 'STAFF')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  // 🔒 ADMIN only: skapa produkt
  @Post()
  @Roles('ADMIN')
  create(@Body() dto: CreateProductDto, @Req() req: any) {
    return this.productsService.create(dto, req.user.id);
  }

  // 🔒 ADMIN only: uppdatera produkt
  @Put(':id')
  @Roles('ADMIN')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateProductDto) {
    return this.productsService.update(id, dto);
  }

  // 🔒 ADMIN only: ta bort produkt
  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  // ✅ STAFF + ADMIN: justera lagersaldo
  @Patch(':id/stock')
  @Roles('ADMIN', 'STAFF')
  adjustStock(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AdjustStockDto,
    @Req() req: any,
  ) {
    return this.productsService.adjustStock(id, dto, req.user.id);
  }
}
