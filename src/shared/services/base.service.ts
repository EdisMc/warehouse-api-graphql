import {
	DeepPartial,
	DeleteResult,
	FindOptionsWhere,
	Repository,
} from 'typeorm';

import { NotFoundException } from '@nestjs/common';

import { BaseEntity } from '../entities/base.entity';

export abstract class BaseService<T extends BaseEntity> {
  constructor(
    protected readonly repo: Repository<T>,
    protected readonly entityName: string,
  ) {}

  async getAll(): Promise<T[]> {
    return this.repo.find();
  }

  async getById(id: string): Promise<T> {
    const item = await this.repo.findOne({
      where: { id } as FindOptionsWhere<T>,
      withDeleted: true, // <- това позволява да намериш и soft deleted записи
    });
    if (!item) throw new NotFoundException(`${this.entityName} not found`);
    return item;
  }

  async softDelete(id: string): Promise<DeleteResult> {
    await this.getById(id);
    return this.repo.softDelete(id);
  }

  async delete(id: string): Promise<DeleteResult> {
    await this.getById(id);
    return this.repo.delete(id);
  }
}
