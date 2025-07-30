import { BaseService } from 'src/shared/services/base.service';
import { Repository } from 'typeorm';

import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Product } from './product.entity';

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

  async create(data: Partial<Product>): Promise<Product> {
    const existing = await this.repo.findOne({
      where: { sku: data.sku, companyId: data.companyId },
    });
    if (existing)
      throw new ConflictException(
        `Product with SKU '${data.sku}' already exists for this company`,
      );
    return super.create(data);
  }

  async update(id: string, data: Partial<Product>): Promise<Product> {
    const product = await this.getById(id);
    if (data.sku && data.sku !== product.sku) {
      const existing = await this.repo.findOne({
        where: { sku: data.sku, companyId: product.companyId },
      });
      if (existing)
        throw new ConflictException(
          `Product with SKU '${data.sku}' already exists for this company`,
        );
    }
    return super.update(id, data);
  }
}
