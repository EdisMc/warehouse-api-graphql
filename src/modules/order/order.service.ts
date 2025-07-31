import { BaseService } from 'src/shared/services/base.service';
import { Repository } from 'typeorm';

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Order } from './order.entity';
import {
	CreateOrderInput,
	createOrderSchema,
	UpdateOrderInput,
	updateOrderSchema,
} from './order.types';

@Injectable()
export class OrderService extends BaseService<Order> {
  constructor(@InjectRepository(Order) repo: Repository<Order>) {
    super(repo, 'Order');
  }

  async findAllByPartner(partnerId: string) {
    return this.repo.find({
      where: { partnerId },
      select: ['id', 'type', 'companyId', 'partnerId', 'warehouseId', 'date'],
    });
  }

  async findAllByWarehouse(warehouseId: string) {
    return this.repo.find({
      where: { warehouseId },
      select: ['id', 'type', 'companyId', 'partnerId', 'warehouseId', 'date'],
    });
  }

  async getAllByCompany(companyId: string) {
    return this.repo.find({
      where: { companyId },
      select: ['id', 'type', 'companyId', 'partnerId', 'warehouseId', 'date'],
    });
  }

  async findAllByCompany(companyId: string) {
    return this.repo.find({
      where: { companyId },
      select: ['id', 'type', 'companyId', 'partnerId', 'warehouseId', 'date'],
    });
  }

  async findById(id: string): Promise<Order | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(input: CreateOrderInput): Promise<Order> {
    const parsed = createOrderSchema.parse(input);
    const order = this.repo.create(parsed);
    return this.repo.save(order);
  }

  async update(id: string, input: UpdateOrderInput): Promise<Order> {
    const parsed = updateOrderSchema.parse(input);
    await this.repo.update(id, parsed);
    return this.getById(id);
  }
}
