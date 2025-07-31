import { BaseResolver } from 'src/shared/resolvers/base.resolver';

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
import { ProductService } from '../product/product.service';
import { ProductType } from '../product/product.types';
import { OrderItemService } from './orderItem.service';
import {
	CreateOrderItemInput,
	OrderItemType,
	UpdateOrderItemInput,
} from './orderItem.types';

@Resolver(() => OrderItemType)
export class OrderItemResolver extends BaseResolver<
  OrderItemType,
  CreateOrderItemInput,
  UpdateOrderItemInput
> {
  constructor(
    protected readonly service: OrderItemService,
    private readonly productService: ProductService,
    private readonly orderService: OrderService,
  ) {
    super(service);
  }

  @Query(() => [OrderItemType])
  async orderItems() {
    return super.findAll();
  }

  @Query(() => OrderItemType, { nullable: true })
  async orderItem(@Args('id') id: string) {
    return super.findOne(id);
  }

  @Mutation(() => OrderItemType)
  async createOrderItem(
    @Args('input', { type: () => CreateOrderItemInput })
    input: CreateOrderItemInput,
  ) {
    return super.create(input);
  }

  @Mutation(() => OrderItemType)
  async updateOrderItem(
    @Args('id') id: string,
    @Args('input', { type: () => UpdateOrderItemInput })
    input: UpdateOrderItemInput,
  ) {
    return super.update(id, input);
  }

  @Mutation(() => Boolean)
  async softDeleteOrderItem(@Args('id') id: string) {
    return super.softDelete(id);
  }

  @Mutation(() => Boolean)
  async deleteOrderItem(@Args('id') id: string) {
    return super.delete(id);
  }

  @ResolveField(() => ProductType, { nullable: true })
  async product(@Parent() orderItem: OrderItemType) {
    return this.productService.findById(orderItem.productId);
  }

  @ResolveField(() => OrderType, { nullable: true })
  async order(@Parent() orderItem: OrderItemType) {
    return this.orderService.findById(orderItem.orderId);
  }
}
