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
import { InvoiceService } from '../invoice/invoice.service';
import { InvoiceType } from '../invoice/invoice.types';
import { OrderItemService } from '../orderItem/orderItem.service';
import { OrderItemType } from '../orderItem/orderItem.types';
import { PartnerService } from '../partner/partner.service';
import { PartnerType } from '../partner/partner.types';
import { WarehouseService } from '../warehouse/warehouse.service';
import { WarehouseType } from '../warehouse/warehouse.types';
import { OrderService } from './order.service';
import { CreateOrderInput, OrderType, UpdateOrderInput } from './order.types';

@Resolver(() => OrderType)
export class OrderResolver extends BaseResolver<
  OrderType,
  CreateOrderInput,
  UpdateOrderInput
> {
  constructor(
    protected readonly service: OrderService,
    private readonly companyService: CompanyService,
    private readonly partnerService: PartnerService,
    private readonly warehouseService: WarehouseService,
    private readonly orderItemService: OrderItemService,
    private readonly invoiceService: InvoiceService,
  ) {
    super(service);
  }

  @Query(() => [OrderType])
  async orders() {
    return super.findAll();
  }

  @Query(() => OrderType, { nullable: true })
  async order(@Args('id') id: string) {
    return super.findOne(id);
  }

  @Mutation(() => OrderType)
  async createOrder(
    @Args('input', { type: () => CreateOrderInput }) input: CreateOrderInput,
  ) {
    return super.create(input);
  }

  @Mutation(() => OrderType)
  async updateOrder(
    @Args('id') id: string,
    @Args('input', { type: () => UpdateOrderInput }) input: UpdateOrderInput,
  ) {
    return super.update(id, input);
  }

  @Mutation(() => Boolean)
  async softDeleteOrder(@Args('id') id: string) {
    return super.softDelete(id);
  }

  @Mutation(() => Boolean)
  async deleteOrder(@Args('id') id: string) {
    return super.delete(id);
  }

  @ResolveField(() => CompanyType, { nullable: true })
  async company(@Parent() order: OrderType) {
    return this.companyService.findById(order.companyId);
  }

  @ResolveField(() => PartnerType, { nullable: true })
  async partner(@Parent() order: OrderType) {
    return this.partnerService.findById(order.partnerId);
  }

  @ResolveField(() => WarehouseType, { nullable: true })
  async warehouse(@Parent() order: OrderType) {
    return this.warehouseService.findById(order.warehouseId);
  }

  @ResolveField(() => [OrderItemType])
  async orderItems(@Parent() order: OrderType) {
    return this.orderItemService.findAllByOrder(order.id);
  }

  @ResolveField(() => InvoiceType, { nullable: true })
  async invoice(@Parent() order: OrderType) {
    return this.invoiceService.findByOrder(order.id);
  }
}
