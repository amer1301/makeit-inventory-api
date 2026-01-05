import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AdjustStockDto } from './dto/adjust-stock.dto';

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
        price: dto.price,
        imageUrl: dto.imageUrl,
        stockQuantity: dto.stockQuantity ?? 0,
        sku: dto.sku,
        categoryId: dto.categoryId,
      },
      include: { category: true },
    });
  }

  async update(id: number, dto: UpdateProductDto) {
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
    await this.findOne(id);
    return this.prisma.product.delete({ where: { id } });
  }

async adjustStock(productId: number, dto: AdjustStockDto, userId: number,) {
  return this.prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({ where: { id: productId } });
    if (!product) throw new NotFoundException('Product not found');

    const nextQty = product.stockQuantity + dto.delta;
    if (nextQty < 0) throw new BadRequestException('Stock cannot be negative');

    const updatedProduct = await tx.product.update({
      where: { id: productId },
      data: { stockQuantity: nextQty },
      include: { category: true },
    });

await tx.stockMovement.create({
  data: {
    productId,
    delta: dto.delta,
    reason: dto.reason,
    createdByUserId: userId,
  },
});

    return updatedProduct;
  });
}

getStockMovements(productId: number) {
  return this.prisma.stockMovement.findMany({
    where: { productId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
}
}
