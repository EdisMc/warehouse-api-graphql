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

  @Query(() => [ProductType])
  async products() {
    return super.findAll();
  }

  @Query(() => ProductType, { nullable: true })
  async product(@Args('id') id: string) {
    return super.findOne(id);
  }

  @Mutation(() => ProductType)
  async createProduct(
    @Args('input', { type: () => CreateProductInput })
    input: CreateProductInput,
  ) {
    return super.create(input);
  }

  @Mutation(() => ProductType)
  async updateProduct(
    @Args('id') id: string,
    @Args('input', { type: () => UpdateProductInput })
    input: UpdateProductInput,
  ) {
    return super.update(id, input);
  }

  @Mutation(() => Boolean)
  async softDeleteProduct(@Args('id') id: string) {
    return super.softDelete(id);
  }

  @Mutation(() => Boolean)
  async deleteProduct(@Args('id') id: string) {
    return super.delete(id);
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
