import { BaseResolver } from 'src/shared/resolvers/base.resolver';

import {
	Args,
	Mutation,
	Parent,
	Query,
	ResolveField,
	Resolver,
} from '@nestjs/graphql';

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

  @Query(() => [WarehouseType])
  async warehouses() {
    return super.findAll();
  }

  @Query(() => WarehouseType, { nullable: true })
  async warehouse(@Args('id') id: string) {
    return super.findOne(id);
  }

  @Mutation(() => WarehouseType)
  async createWarehouse(
    @Args('input', { type: () => CreateWarehouseInput })
    input: CreateWarehouseInput,
  ) {
    return super.create(input);
  }

  @Mutation(() => WarehouseType)
  async updateWarehouse(
    @Args('id') id: string,
    @Args('input', { type: () => UpdateWarehouseInput })
    input: UpdateWarehouseInput,
  ) {
    return super.update(id, input);
  }

  @Mutation(() => Boolean)
  async softDeleteWarehouse(@Args('id') id: string) {
    return super.softDelete(id);
  }

  @Mutation(() => Boolean)
  async deleteWarehouse(@Args('id') id: string) {
    return super.delete(id);
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
