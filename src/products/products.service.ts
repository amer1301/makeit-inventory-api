import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.product.findMany({
      include: { category: true },
      orderBy: { id: 'desc' },
    });
  }

  async findOne(id: number) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  create(dto: CreateProductDto) {
    return this.prisma.product.create({
      data: {
        name: dto.name,
        description: dto.description,
        price: dto.price, // Prisma Decimal: number funkar fint här
        imageUrl: dto.imageUrl,
        stockQuantity: dto.stockQuantity ?? 0,
        sku: dto.sku,
        categoryId: dto.categoryId,
      },
      include: { category: true },
    });
  }

  async update(id: number, dto: UpdateProductDto) {
    // valfritt men snyggt: 404 om produkten saknas
    await this.findOne(id);

    return this.prisma.product.update({
      where: { id },
      data: {
        ...(dto.name !== undefined ? { name: dto.name } : {}),
        ...(dto.description !== undefined ? { description: dto.description } : {}),
        ...(dto.price !== undefined ? { price: dto.price } : {}),
        ...(dto.imageUrl !== undefined ? { imageUrl: dto.imageUrl } : {}),
        ...(dto.stockQuantity !== undefined ? { stockQuantity: dto.stockQuantity } : {}),
        ...(dto.sku !== undefined ? { sku: dto.sku } : {}),
        ...(dto.categoryId !== undefined ? { categoryId: dto.categoryId } : {}),
      },
      include: { category: true },
    });
  }

  async remove(id: number) {
    // 404 om saknas
    await this.findOne(id);

    return this.prisma.product.delete({ where: { id } });
  }
}
