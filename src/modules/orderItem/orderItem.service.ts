import { BaseService } from 'src/shared/services/base.service';
import { In, Repository } from 'typeorm';

import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Order } from '../order/order.entity';
import { OrderItem } from './orderItem.entity';

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

  async create(data: Partial<OrderItem>): Promise<OrderItem> {
    const existing = await this.repo.findOne({
      where: { productId: data.productId, orderId: data.orderId },
    });
    if (existing)
      throw new ConflictException(`Product already exists in this order`);
    return super.create(data);
  }

  async update(id: string, data: Partial<OrderItem>): Promise<OrderItem> {
    return super.update(id, data);
  }
}
