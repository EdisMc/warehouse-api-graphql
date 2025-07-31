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

  @Query(() => [PartnerType])
  async partners() {
    return super.findAll();
  }

  @Query(() => PartnerType, { nullable: true })
  async partner(@Args('id') id: string) {
    return super.findOne(id);
  }

  @Mutation(() => PartnerType)
  async createPartner(
    @Args('input', { type: () => CreatePartnerInput })
    input: CreatePartnerInput,
  ) {
    return super.create(input);
  }

  @Mutation(() => PartnerType)
  async updatePartner(
    @Args('id') id: string,
    @Args('input', { type: () => UpdatePartnerInput })
    input: UpdatePartnerInput,
  ) {
    return super.update(id, input);
  }

  @Mutation(() => Boolean)
  async softDeletePartner(@Args('id') id: string) {
    return super.softDelete(id);
  }

  @Mutation(() => Boolean)
  async deletePartner(@Args('id') id: string) {
    return super.delete(id);
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
