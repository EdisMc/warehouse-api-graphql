import { BaseService } from 'src/shared/services/base.service';
import { Repository } from 'typeorm';

import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Product } from './product.entity';
import {
	CreateProductInput,
	createProductSchema,
	UpdateProductInput,
	updateProductSchema,
} from './product.types';

@Injectable()
export class ProductService extends BaseService<Product> {
  constructor(@InjectRepository(Product) repo: Repository<Product>) {
    super(repo, 'Product');
  }

  async getAllByCompany(companyId: string) {
    return this.repo.find({
      where: { companyId },
      select: [
        'id',
        'name',
        'sku',
        'prodType',
        'price',
        'companyId',
        'warehouseId',
      ],
    });
  }

  async findAllByCompany(companyId: string) {
    return this.repo.find({
      where: { companyId },
      select: [
        'id',
        'name',
        'sku',
        'prodType',
        'price',
        'companyId',
        'warehouseId',
      ],
    });
  }

  async findById(id: string): Promise<Product | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findAllByWarehouse(warehouseId: string) {
    return this.repo.find({
      where: { warehouseId },
      select: [
        'id',
        'name',
        'sku',
        'prodType',
        'price',
        'companyId',
        'warehouseId',
      ],
    });
  }

  async create(input: CreateProductInput): Promise<Product> {
    const parsed = createProductSchema.parse(input);
    const existing = await this.repo.findOne({
      where: { sku: parsed.sku, companyId: parsed.companyId },
    });
    if (existing)
      throw new ConflictException(
        `Product with SKU '${parsed.sku}' already exists for this company`,
      );
    const product = this.repo.create(parsed);
    return this.repo.save(product);
  }

  async update(id: string, input: UpdateProductInput): Promise<Product> {
    const parsed = updateProductSchema.parse(input);
    const product = await this.getById(id);
    if (parsed.sku && parsed.sku !== product.sku) {
      const existing = await this.repo.findOne({
        where: { sku: parsed.sku, companyId: product.companyId },
      });
      if (existing)
        throw new ConflictException(
          `Product with SKU '${parsed.sku}' already exists for this company`,
        );
    }
    await this.repo.update(id, parsed);
    return this.getById(id);
  }
}
