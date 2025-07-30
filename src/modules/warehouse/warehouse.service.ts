import { BaseService } from 'src/shared/services/base.service';
import { Repository } from 'typeorm';

import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Warehouse } from './warehouse.entity';

@Injectable()
export class WarehouseService extends BaseService<Warehouse> {
  constructor(@InjectRepository(Warehouse) repo: Repository<Warehouse>) {
    super(repo, 'Warehouse');
  }

  async getAllByCompany(companyId: string) {
    return this.repo.find({
      where: { companyId },
      select: ['id', 'name', 'companyId', 'location', 'supportType'],
    });
  }

  async findAllByCompany(companyId: string) {
    return this.repo.find({
      where: { companyId },
      select: ['id', 'name', 'location', 'supportType', 'companyId'],
    });
  }

  async findById(id: string): Promise<Warehouse | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(data: Partial<Warehouse>): Promise<Warehouse> {
    const existing = await this.repo.findOne({
      where: { name: data.name, companyId: data.companyId },
    });
    if (existing)
      throw new ConflictException(
        `Warehouse with name '${data.name}' already exists for this company`,
      );
    return super.create(data);
  }

  async update(id: string, data: Partial<Warehouse>): Promise<Warehouse> {
    const warehouse = await this.getById(id);
    if (data.name && data.name !== warehouse.name) {
      const existing = await this.repo.findOne({
        where: { name: data.name, companyId: warehouse.companyId },
      });
      if (existing)
        throw new ConflictException(
          `Warehouse with name '${data.name}' already exists for this company`,
        );
    }
    return super.update(id, data);
  }
}
