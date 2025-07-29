import {
  DeepPartial,
  DeleteResult,
  FindOptionsWhere,
  Repository,
} from 'typeorm';

import { NotFoundException } from '@nestjs/common';

import { BaseEntity } from '../entity/base.entity';

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
    });
    if (!item) throw new NotFoundException(`${this.entityName} not found`);
    return item;
  }

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repo.create(data);
    return this.repo.save(entity);
  }

  async update(id: string, data: Partial<T>): Promise<T> {
    const item = await this.getById(id);
    Object.assign(item, data);
    return this.repo.save(item);
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
