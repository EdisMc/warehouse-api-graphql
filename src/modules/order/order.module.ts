import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompanyModule } from '../company/company.module';
import { InvoiceModule } from '../invoice/invoice.module';
import { OrderItemModule } from '../orderItem/orderItem.module';
import { PartnerModule } from '../partner/partner.module';
import { WarehouseModule } from '../warehouse/warehouse.module';
import { Order } from './order.entity';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    forwardRef(() => CompanyModule),
    PartnerModule,
    WarehouseModule,
    OrderItemModule,
    InvoiceModule,
  ],
  providers: [OrderService, OrderResolver],
  exports: [OrderService],
})
export class OrderModule {}
