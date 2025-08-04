import { CurrentCompany } from 'src/decorators/current-company.decorator';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { ReportsService } from 'src/reports/reports.service';
import { HighestStockProductType } from 'src/reports/reports.types';
import { BaseResolver } from 'src/shared/resolvers/base.resolver';

import { Inject, Res, UseGuards } from '@nestjs/common';
import {
	Args,
	Mutation,
	Parent,
	Query,
	ResolveField,
	Resolver,
} from '@nestjs/graphql';

import { OrderService } from '../order/order.service';
import { OrderType } from '../order/order.types';
import { PartnerService } from '../partner/partner.service';
import { PartnerType } from '../partner/partner.types';
import { ProductService } from '../product/product.service';
import { ProductType } from '../product/product.types';
import { UserService } from '../user/user.service';
import { UserType } from '../user/user.types';
import { WarehouseService } from '../warehouse/warehouse.service';
import { WarehouseType } from '../warehouse/warehouse.types';
import { CompanyService } from './company.service';
import {
	CompanyType,
	CreateCompanyInput,
	UpdateCompanyInput,
} from './company.types';

@Resolver(() => CompanyType)
export class CompanyResolver extends BaseResolver<
  CompanyType,
  CreateCompanyInput,
  UpdateCompanyInput
> {
  constructor(
    protected readonly service: CompanyService,
    private readonly userService: UserService,
    private readonly productService: ProductService,
    private readonly warehouseService: WarehouseService,
    private readonly partnerService: PartnerService,
    private readonly orderService: OrderService,
    @Inject(ReportsService)
    private readonly reportsService: ReportsService,
  ) {
    super(service);
  }

  @Query(() => [CompanyType])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'OPERATOR', 'VIEWER')
  async companies(@CurrentCompany() companyId: string) {
    const company = await this.service.findById(companyId);
    return company ? [company] : [];
  }

  @Query(() => CompanyType, { nullable: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'OPERATOR', 'VIEWER')
  async myCompany(@CurrentCompany() companyId: string) {
    return this.service.findById(companyId);
  }

  @Mutation(() => CompanyType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  async updateCompany(
    @Args('input', { type: () => UpdateCompanyInput })
    input: UpdateCompanyInput,
    @CurrentCompany() companyId: string,
  ) {
    return this.service.update(companyId, input);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  async softDeleteCompany(@CurrentCompany() companyId: string) {
    await this.service.softDelete(companyId);
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  async deleteCompany(@CurrentCompany() companyId: string) {
    await this.service.delete(companyId);
    return true;
  }

  @ResolveField(() => [UserType])
  async users(@Parent() company: CompanyType) {
    return this.userService.findAllByCompany(company.id);
  }

  @ResolveField(() => [ProductType])
  async products(@Parent() company: CompanyType) {
    return this.productService.findAllByCompany(company.id);
  }

  @ResolveField(() => [WarehouseType])
  async warehouses(@Parent() company: CompanyType) {
    return this.warehouseService.findAllByCompany(company.id);
  }

  @ResolveField(() => [PartnerType])
  async partners(@Parent() company: CompanyType) {
    return this.partnerService.findAllByCompany(company.id);
  }

  @ResolveField(() => [OrderType])
  async orders(@Parent() company: CompanyType) {
    return this.orderService.findAllByCompany(company.id);
  }

  @ResolveField(() => [HighestStockProductType])
  async highestStockProductPerWarehouse(@CurrentCompany() companyId: string) {
    return this.reportsService.getHighestStockProductPerWarehouse(companyId);
  }
}
