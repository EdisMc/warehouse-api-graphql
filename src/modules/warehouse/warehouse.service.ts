import { BaseService } from 'src/shared/services/base.service';
import { Repository } from 'typeorm';

import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Warehouse } from './warehouse.entity';
import {
	CreateWarehouseInput,
	createWarehouseSchema,
	UpdateWarehouseInput,
	updateWarehouseSchema,
} from './warehouse.types';

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

  async create(input: CreateWarehouseInput): Promise<Warehouse> {
    const parsed = createWarehouseSchema.parse(input);
    const existing = await this.repo.findOne({
      where: { name: parsed.name, companyId: parsed.companyId },
    });
    if (existing)
      throw new ConflictException(
        `Warehouse with name '${parsed.name}' already exists for this company`,
      );
    const warehouse = this.repo.create(parsed);
    return this.repo.save(warehouse);
  }

  async update(id: string, input: UpdateWarehouseInput): Promise<Warehouse> {
    const parsed = updateWarehouseSchema.parse(input);
    const warehouse = await this.getById(id);
    if (parsed.name && parsed.name !== warehouse.name) {
      const existing = await this.repo.findOne({
        where: { name: parsed.name, companyId: warehouse.companyId },
      });
      if (existing)
        throw new ConflictException(
          `Warehouse with name '${parsed.name}' already exists for this company`,
        );
    }
    await this.repo.update(id, parsed);
    return this.getById(id);
  }
}
