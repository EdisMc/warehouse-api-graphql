import { BaseService } from 'src/shared/services/base.service';
import { In, Repository } from 'typeorm';

import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Order } from '../order/order.entity';
import { OrderItem } from './orderItem.entity';
import {
	CreateOrderItemInput,
	createOrderItemSchema,
	UpdateOrderItemInput,
	updateOrderItemSchema,
} from './orderItem.types';

@Injectable()
export class OrderItemService extends BaseService<OrderItem> {
  constructor(@InjectRepository(OrderItem) repo: Repository<OrderItem>) {
    super(repo, 'OrderItem');
  }

  async getAllByCompany(companyId: string) {
    const orders = await this.repo.manager.find(Order, {
      where: { companyId },
      select: ['id'],
    });
    const orderIds = orders.map((order) => order.id);

    if (orderIds.length === 0) return [];

    return this.repo.find({
      where: { orderId: In(orderIds) },
      select: ['id', 'orderId', 'productId', 'quantity', 'priceAtOrder'],
    });
  }

  async findAllByProduct(productId: string) {
    return this.repo.find({
      where: { productId },
      select: ['id', 'orderId', 'productId', 'quantity', 'priceAtOrder'],
    });
  }

  async findAllByOrder(orderId: string) {
    return this.repo.find({
      where: { orderId },
      select: ['id', 'orderId', 'productId', 'quantity', 'priceAtOrder'],
    });
  }

  async create(input: CreateOrderItemInput): Promise<OrderItem> {
    const parsed = createOrderItemSchema.parse(input);
    const existing = await this.repo.findOne({
      where: { productId: parsed.productId, orderId: parsed.orderId },
    });
    if (existing)
      throw new ConflictException(`Product already exists in this order`);
    const orderItem = this.repo.create(parsed);
    return this.repo.save(orderItem);
  }

  async update(id: string, input: UpdateOrderItemInput): Promise<OrderItem> {
    const parsed = updateOrderItemSchema.parse(input);
    await this.repo.update(id, parsed);
    return this.getById(id);
  }
}
