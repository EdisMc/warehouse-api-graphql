import { CurrentCompany } from 'src/decorators/current-company.decorator';
import { Roles } from 'src/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { BaseResolver } from 'src/shared/resolvers/base.resolver';

import { UseGuards } from '@nestjs/common';
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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'OPERATOR', 'VIEWER')
  async orderItems(@CurrentCompany() companyId: string) {
    const orders = await this.orderService.getAllByCompany(companyId);
    const orderIds = orders.map((o) => o.id);
    return this.service.findAllByOrderIds(orderIds);
  }

  @Query(() => OrderItemType, { nullable: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'OPERATOR', 'VIEWER')
  async orderItem(@Args('id') id: string, @CurrentCompany() companyId: string) {
    const orderItem = await super.findOne(id);
    if (!orderItem) return null;
    const order = await this.orderService.findById(orderItem.orderId);
    return order && order.companyId === companyId ? orderItem : null;
  }

  @Mutation(() => OrderItemType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'OPERATOR')
  async createOrderItem(
    @Args('input', { type: () => CreateOrderItemInput })
    input: CreateOrderItemInput,
    @CurrentCompany() companyId: string,
  ) {
    const order = await this.orderService.findById(input.orderId);
    if (!order || order.companyId !== companyId) throw new Error('Forbidden');
    return super.create(input);
  }

  @Mutation(() => OrderItemType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'OPERATOR')
  async updateOrderItem(
    @Args('id') id: string,
    @Args('input', { type: () => UpdateOrderItemInput })
    input: UpdateOrderItemInput,
    @CurrentCompany() companyId: string,
  ) {
    const orderItem = await super.findOne(id);
    if (!orderItem) throw new Error('Not found');
    const order = await this.orderService.findById(orderItem.orderId);
    if (!order || order.companyId !== companyId) throw new Error('Forbidden');
    return super.update(id, input);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  async softDeleteOrderItem(
    @Args('id') id: string,
    @CurrentCompany() companyId: string,
  ) {
    const orderItem = await super.findOne(id);
    if (!orderItem) throw new Error('Not found');
    const order = await this.orderService.findById(orderItem.orderId);
    if (!order || order.companyId !== companyId) throw new Error('Forbidden');
    await super.softDelete(id);
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  async deleteOrderItem(
    @Args('id') id: string,
    @CurrentCompany() companyId: string,
  ) {
    const orderItem = await super.findOne(id);
    if (!orderItem) throw new Error('Not found');
    const order = await this.orderService.findById(orderItem.orderId);
    if (!order || order.companyId !== companyId) throw new Error('Forbidden');
    await super.delete(id);
    return true;
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
