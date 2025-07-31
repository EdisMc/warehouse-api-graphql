import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderModule } from '../order/order.module';
import { ProductModule } from '../product/product.module';
import { OrderItem } from './orderItem.entity';
import { OrderItemResolver } from './orderItem.resolver';
import { OrderItemService } from './orderItem.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([OrderItem]),
    forwardRef(() => ProductModule),
    forwardRef(() => OrderModule),
  ],
  providers: [OrderItemService, OrderItemResolver],
  exports: [OrderItemService],
})
export class OrderItemModule {}
