import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';

import { CategoriesService } from './categories.service';

import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('categories')
@UseGuards(JwtAuthGuard, RolesGuard) // ✅ skyddar alla category-routes
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // ✅ STAFF + ADMIN: läsa kategorier
  @Get()
  @Roles('ADMIN', 'STAFF')
  findAll() {
    return this.categoriesService.findAll();
  }

    @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.findOne(id);
  }
  
  // 🔒 ADMIN only: skapa kategori
  @Post()
  @Roles('ADMIN')
  create(@Body() body: { name: string; description?: string }) {
    return this.categoriesService.create(body);
  }

  // 🔒 ADMIN only: uppdatera kategori
  @Put(':id')
  @Roles('ADMIN')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { name?: string; description?: string },
  ) {
    return this.categoriesService.update(id, body);
  }

  // 🔒 ADMIN only: ta bort kategori
  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.categoriesService.remove(id);
  }
}
