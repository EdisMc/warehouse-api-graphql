import { BaseResolver } from 'src/shared/resolvers/base.resolver';

import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

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
  ) {
    super(service);
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
}
