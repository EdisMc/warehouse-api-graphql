import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompanyModule } from '../company/company.module';
import { OrderItemModule } from '../orderItem/orderItem.module';
import { WarehouseModule } from '../warehouse/warehouse.module';
import { Product } from './product.entity';
import { ProductResolver } from './product.resolver';
import { ProductService } from './product.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product]),
    forwardRef(() => CompanyModule),
    forwardRef(() => WarehouseModule),
    forwardRef(() => OrderItemModule),
  ],
  providers: [ProductService, ProductResolver],
  exports: [ProductService],
})
export class ProductModule {}
