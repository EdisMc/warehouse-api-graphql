import { BaseResolver } from 'src/shared/resolvers/base.resolver';

import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { CompanyService } from '../company/company.service';
import { CompanyType } from '../company/company.types';
import { OrderItemService } from '../orderItem/orderItem.service';
import { OrderItemType } from '../orderItem/orderItem.types';
import { WarehouseService } from '../warehouse/warehouse.service';
import { WarehouseType } from '../warehouse/warehouse.types';
import { ProductService } from './product.service';
import {
	CreateProductInput,
	ProductType,
	UpdateProductInput,
} from './product.types';

@Resolver(() => ProductType)
export class ProductResolver extends BaseResolver<
  ProductType,
  CreateProductInput,
  UpdateProductInput
> {
  constructor(
    protected readonly service: ProductService,
    private readonly companyService: CompanyService,
    private readonly warehouseService: WarehouseService,
    private readonly orderItemService: OrderItemService,
  ) {
    super(service);
  }

  @ResolveField(() => CompanyType, { nullable: true })
  async company(@Parent() product: ProductType) {
    return this.companyService.findById(product.companyId);
  }

  @ResolveField(() => WarehouseType, { nullable: true })
  async warehouse(@Parent() product: ProductType) {
    return this.warehouseService.findById(product.warehouseId);
  }

  @ResolveField(() => [OrderItemType])
  async orderItems(@Parent() product: ProductType) {
    return this.orderItemService.findAllByProduct(product.id);
  }
}
