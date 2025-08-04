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
import { InvoiceService } from './invoice.service';
import {
	CreateInvoiceInput,
	InvoiceType,
	UpdateInvoiceInput,
} from './invoice.types';

@Resolver(() => InvoiceType)
export class InvoiceResolver extends BaseResolver<
  InvoiceType,
  CreateInvoiceInput,
  UpdateInvoiceInput
> {
  constructor(
    protected readonly service: InvoiceService,
    private readonly orderService: OrderService,
  ) {
    super(service);
  }

  @Query(() => [InvoiceType])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'OPERATOR', 'VIEWER')
  async invoices(@CurrentCompany() companyId: string) {
    return this.service.getAllByCompany(companyId);
  }

  @Query(() => InvoiceType, { nullable: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'OPERATOR', 'VIEWER')
  async invoice(@Args('id') id: string, @CurrentCompany() companyId: string) {
    const invoice = await super.findOne(id);
    if (!invoice) return null;
    const order = await this.orderService.findById(invoice.orderId);
    return order && order.companyId === companyId ? invoice : null;
  }

  @Mutation(() => InvoiceType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'OPERATOR')
  async createInvoice(
    @Args('input', { type: () => CreateInvoiceInput })
    input: CreateInvoiceInput,
    @CurrentCompany() companyId: string,
  ) {
    return this.service.create(input);
  }

  @Mutation(() => InvoiceType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'OPERATOR')
  async updateInvoice(
    @Args('id') id: string,
    @Args('input', { type: () => UpdateInvoiceInput })
    input: UpdateInvoiceInput,
    @CurrentCompany() companyId: string,
  ) {
    return this.service.update(id, input);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  async softDeleteInvoice(@Args('id') id: string) {
    await this.service.softDelete(id);
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  async deleteInvoice(@Args('id') id: string) {
    await this.service.delete(id);
    return true;
  }

  @ResolveField(() => OrderType, { nullable: true })
  async order(@Parent() invoice: InvoiceType) {
    return this.orderService.findById(invoice.orderId);
  }
}
