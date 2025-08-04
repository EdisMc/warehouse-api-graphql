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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'OPERATOR', 'VIEWER')
  async orders(@CurrentCompany() companyId: string) {
    return this.service.getAllByCompany(companyId);
  }

  @Query(() => OrderType, { nullable: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'OPERATOR', 'VIEWER')
  async order(@Args('id') id: string, @CurrentCompany() companyId: string) {
    const order = await super.findOne(id);
    return order && order.companyId === companyId ? order : null;
  }

  @Mutation(() => OrderType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'OPERATOR')
  async createOrder(
    @Args('input', { type: () => CreateOrderInput }) input: CreateOrderInput,
    @CurrentCompany() companyId: string,
  ) {
    return this.service.create({ ...input, companyId });
  }

  @Mutation(() => OrderType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'OPERATOR')
  async updateOrder(
    @Args('id') id: string,
    @Args('input', { type: () => UpdateOrderInput }) input: UpdateOrderInput,
    @CurrentCompany() companyId: string,
  ) {
    return this.service.update(id, { ...input, companyId });
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  async softDeleteOrder(@Args('id') id: string) {
    return super.softDelete(id);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
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
