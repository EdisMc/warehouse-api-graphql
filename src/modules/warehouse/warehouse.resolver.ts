import { BaseResolver } from 'src/shared/resolvers/base.resolver';

import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { CompanyService } from '../company/company.service';
import { CompanyType } from '../company/company.types';
import { OrderService } from '../order/order.service';
import { OrderType } from '../order/order.types';
import { ProductService } from '../product/product.service';
import { ProductType } from '../product/product.types';
import { WarehouseService } from './warehouse.service';
import {
	CreateWarehouseInput,
	UpdateWarehouseInput,
	WarehouseType,
} from './warehouse.types';

@Resolver(() => WarehouseType)
export class WarehouseResolver extends BaseResolver<
  WarehouseType,
  CreateWarehouseInput,
  UpdateWarehouseInput
> {
  constructor(
    protected readonly service: WarehouseService,
    private readonly companyService: CompanyService,
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
  ) {
    super(service);
  }

  @ResolveField(() => CompanyType, { nullable: true })
  async company(@Parent() warehouse: WarehouseType) {
    return this.companyService.findById(warehouse.companyId);
  }

  @ResolveField(() => [OrderType])
  async orders(@Parent() warehouse: WarehouseType) {
    return this.orderService.findAllByWarehouse(warehouse.id);
  }

  @ResolveField(() => [ProductType])
  async products(@Parent() warehouse: WarehouseType) {
    return this.productService.findAllByWarehouse(warehouse.id);
  }
}
