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
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'OPERATOR', 'VIEWER')
  async partners(@CurrentCompany() companyId: string) {
    return this.service.findAllByCompany(companyId);
  }

  @Query(() => PartnerType, { nullable: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'OPERATOR', 'VIEWER')
  async partner(@Args('id') id: string, @CurrentCompany() companyId: string) {
    const partner = await super.findOne(id);
    return partner && partner.companyId === companyId ? partner : null;
  }

  @Mutation(() => PartnerType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'OPERATOR')
  async createPartner(
    @Args('input', { type: () => CreatePartnerInput })
    input: CreatePartnerInput,
    @CurrentCompany() companyId: string,
  ) {
    return super.create({ ...input, companyId });
  }

  @Mutation(() => PartnerType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'OPERATOR')
  async updatePartner(
    @Args('id') id: string,
    @Args('input', { type: () => UpdatePartnerInput })
    input: UpdatePartnerInput,
    @CurrentCompany() companyId: string,
  ) {
    return super.update(id, { ...input, companyId });
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  async softDeletePartner(
    @Args('id') id: string,
    @CurrentCompany() companyId: string,
  ) {
    const partner = await super.findOne(id);
    if (!partner || partner.companyId !== companyId)
      throw new Error('Forbidden');
    await super.softDelete(id);
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  async deletePartner(
    @Args('id') id: string,
    @CurrentCompany() companyId: string,
  ) {
    const partner = await super.findOne(id);
    if (!partner || partner.companyId !== companyId)
      throw new Error('Forbidden');
    await super.delete(id);
    return true;
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
