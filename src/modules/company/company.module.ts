import { ReportsModule } from 'src/reports/reports.module';
import { ReportsService } from 'src/reports/reports.service';

import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { OrderModule } from '../order/order.module';
import { PartnerModule } from '../partner/partner.module';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { WarehouseModule } from '../warehouse/warehouse.module';
import { Company } from './company.entity';
import { CompanyResolver } from './company.resolver';
import { CompanyService } from './company.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Company]),
    forwardRef(() => UserModule),
    forwardRef(() => ProductModule),
    forwardRef(() => WarehouseModule),
    PartnerModule,
    OrderModule,
    ReportsModule,
  ],
  providers: [CompanyService, CompanyResolver],
  exports: [CompanyService],
})
export class CompanyModule {}
