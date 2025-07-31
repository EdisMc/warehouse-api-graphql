import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompanyModule } from '../company/company.module';
import { OrderModule } from '../order/order.module';
import { ProductModule } from '../product/product.module';
import { Warehouse } from './warehouse.entity';
import { WarehouseResolver } from './warehouse.resolver';
import { WarehouseService } from './warehouse.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Warehouse]),
    forwardRef(() => CompanyModule),
    forwardRef(() => OrderModule),
    forwardRef(() => ProductModule),
  ],
  providers: [WarehouseService, WarehouseResolver],
  exports: [WarehouseService],
})
export class WarehouseModule {}
