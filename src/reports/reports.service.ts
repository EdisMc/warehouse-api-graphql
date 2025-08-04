import { Order } from 'src/modules/order/order.entity';
import { OrderItem } from 'src/modules/orderItem/orderItem.entity';
import { Partner } from 'src/modules/partner/partner.entity';
import { Product } from 'src/modules/product/product.entity';
import { Warehouse } from 'src/modules/warehouse/warehouse.entity';
import { Repository } from 'typeorm';

import { Injectable, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import {
	BestsellingProductType,
	HighestStockProductType,
	TopClientType,
} from './reports.types';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(OrderItem) private orderItemRepo: Repository<OrderItem>,
    @InjectRepository(Order) private orderRepo: Repository<Order>,
    @InjectRepository(Partner) private partnerRepo: Repository<Partner>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(Warehouse) private warehouseRepo: Repository<Warehouse>,
  ) {}

  async getBestsellingProducts(
    companyId: string,
  ): Promise<BestsellingProductType[]> {
    return this.orderItemRepo
      .createQueryBuilder('oi')
      .innerJoin('product', 'p', 'p.id = oi.productId')
      .innerJoin('order', 'o', 'o.id = oi.orderId')
      .select([
        'p.id AS productId',
        'p.name AS productName',
        'SUM(oi.quantity) AS totalSold',
      ])
      .where('p.companyId = :companyId', { companyId })
      .groupBy('p.id')
      .addGroupBy('p.name')
      .orderBy('totalSold', 'DESC')
      .limit(3)
      .getRawMany<BestsellingProductType>();
  }

  async getTopClient(companyId: string): Promise<TopClientType | null> {
    const result = await this.orderRepo
      .createQueryBuilder('o')
      .innerJoin('partner', 'partner', 'partner.id = o.partner_id')
      .select([
        'partner.id AS partnerId',
        'partner.name AS partnerName',
        'COUNT(o.id) AS ordersCount',
      ])
      .where('o.company_id = :companyId', { companyId })
      .andWhere('o.type = :type', { type: 'delivery' })
      .groupBy('partner.id')
      .addGroupBy('partner.name')
      .orderBy('ordersCount', 'DESC')
      .limit(1)
      .getRawOne<TopClientType>();

    return result || null;
  }

  async getHighestStockProductPerWarehouse(
    companyId: string,
  ): Promise<HighestStockProductType[]> {
    const all = await this.orderItemRepo
      .createQueryBuilder('oi')
      .innerJoin('product', 'p', 'p.id = oi.productId')
      .innerJoin('order', 'o', 'o.id = oi.orderId')
      .innerJoin('warehouse', 'w', 'w.id = o.warehouse_id')
      .select([
        'w.id AS warehouseId',
        'w.name AS warehouseName',
        'p.id AS productId',
        'p.name AS productName',
        'SUM(oi.quantity) AS totalQuantity',
      ])
      .where('o.company_id = :companyId', { companyId })
      .groupBy('w.id')
      .addGroupBy('w.name')
      .addGroupBy('p.id')
      .addGroupBy('p.name')
      .getRawMany<HighestStockProductType>();

    return all;
  }
}
