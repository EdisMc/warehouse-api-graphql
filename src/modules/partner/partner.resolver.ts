import { BaseResolver } from 'src/shared/resolvers/base.resolver';

import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { CompanyService } from '../company/company.service';
import { CompanyType } from '../company/company.types';
import { OrderService } from '../order/order.service';
import { OrderType } from '../order/order.types';
import { PartnerService } from './partner.service';
import {
	CreatePartnerInput,
	PartnerType,
	UpdatePartnerInput,
} from './partner.types';

@Resolver(() => PartnerType)
export class PartnerResolver extends BaseResolver<
  PartnerType,
  CreatePartnerInput,
  UpdatePartnerInput
> {
  constructor(
    protected readonly service: PartnerService,
    private readonly companyService: CompanyService,
    private readonly orderService: OrderService,
  ) {
    super(service);
  }

  @ResolveField(() => CompanyType, { nullable: true })
  async company(@Parent() partner: PartnerType) {
    return this.companyService.findById(partner.companyId);
  }

  @ResolveField(() => [OrderType])
  async orders(@Parent() partner: PartnerType) {
    return this.orderService.findAllByPartner(partner.id);
  }
}
