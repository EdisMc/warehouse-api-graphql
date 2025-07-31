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
  async invoices() {
    return super.findAll();
  }

  @Query(() => InvoiceType, { nullable: true })
  async invoice(@Args('id') id: string) {
    return super.findOne(id);
  }

  @Mutation(() => InvoiceType)
  async createInvoice(
    @Args('input', { type: () => CreateInvoiceInput })
    input: CreateInvoiceInput,
  ) {
    return super.create(input);
  }

  @Mutation(() => InvoiceType)
  async updateInvoice(
    @Args('id') id: string,
    @Args('input', { type: () => UpdateInvoiceInput })
    input: UpdateInvoiceInput,
  ) {
    return super.update(id, input);
  }

  @Mutation(() => Boolean)
  async softDeleteInvoice(@Args('id') id: string) {
    return super.softDelete(id);
  }

  @Mutation(() => Boolean)
  async deleteInvoice(@Args('id') id: string) {
    return super.delete(id);
  }

  @ResolveField(() => OrderType, { nullable: true })
  async order(@Parent() invoice: InvoiceType) {
    return this.orderService.findById(invoice.orderId);
  }
}
