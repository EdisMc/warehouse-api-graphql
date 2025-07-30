import { BaseResolver } from 'src/shared/resolvers/base.resolver';

import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

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

  @ResolveField(() => OrderType, { nullable: true })
  async order(@Parent() invoice: InvoiceType) {
    return this.orderService.findById(invoice.orderId);
  }
}
