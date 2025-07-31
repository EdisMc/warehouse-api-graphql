import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { CompanyModule } from '../company/company.module';
import { OrderModule } from '../order/order.module';
import { Partner } from './partner.entity';
import { PartnerResolver } from './partner.resolver';
import { PartnerService } from './partner.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Partner]),
    forwardRef(() => CompanyModule),
    forwardRef(() => OrderModule),
  ],
  providers: [PartnerService, PartnerResolver],
  exports: [PartnerService],
})
export class PartnerModule {}
