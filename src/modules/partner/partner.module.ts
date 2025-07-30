import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Partner } from './partner.entity';
import { PartnerResolver } from './partner.resolver';
import { PartnerService } from './partner.service';

@Module({
  imports: [TypeOrmModule.forFeature([Partner])],
  providers: [PartnerService, PartnerResolver],
  exports: [PartnerService],
})
export class PartnerModule {}
