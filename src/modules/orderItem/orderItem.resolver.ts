import { BaseResolver } from 'src/shared/resolvers/base.resolver';

import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

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

  @ResolveField(() => ProductType, { nullable: true })
  async product(@Parent() orderItem: OrderItemType) {
    return this.productService.findById(orderItem.productId);
  }

  @ResolveField(() => OrderType, { nullable: true })
  async order(@Parent() orderItem: OrderItemType) {
    return this.orderService.findById(orderItem.orderId);
  }
}
