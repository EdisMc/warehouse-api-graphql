import { CurrentCompany } from 'src/decorators/current-company.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';

import { UseGuards } from '@nestjs/common';
import { Query, Resolver } from '@nestjs/graphql';

import { ReportsService } from './reports.service';
import {
	BestsellingProductType,
	HighestStockProductType,
	TopClientType,
} from './reports.types';

@Resolver()
export class ReportsResolver {
  constructor(private readonly reportsService: ReportsService) {}

  @Query(() => [BestsellingProductType])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'OPERATOR', 'VIEWER')
  async bestsellingProducts(@CurrentCompany() companyId: string) {
    return this.reportsService.getBestsellingProducts(companyId);
  }

  @Query(() => TopClientType, { nullable: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'OPERATOR', 'VIEWER')
  async topClient(@CurrentCompany() companyId: string) {
    return this.reportsService.getTopClient(companyId);
  }

  @Query(() => [HighestStockProductType])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'OPERATOR', 'VIEWER')
  async highestStockProductPerWarehouse(@CurrentCompany() companyId: string) {
    return this.reportsService.getHighestStockProductPerWarehouse(companyId);
  }
}
