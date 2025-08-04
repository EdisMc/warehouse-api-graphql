import { Order } from 'src/modules/order/order.entity';
import { OrderItem } from 'src/modules/orderItem/orderItem.entity';
import { Partner } from 'src/modules/partner/partner.entity';
import { Product } from 'src/modules/product/product.entity';
import { Warehouse } from 'src/modules/warehouse/warehouse.entity';

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReportsResolver } from './reports.resolver';
import { ReportsService } from './reports.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderItem, Order, Partner, Product, Warehouse]),
  ],
  providers: [ReportsService, ReportsResolver],
  exports: [ReportsService],
})
export class ReportsModule {}
