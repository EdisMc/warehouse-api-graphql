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
import { ProductService } from '../product/product.service';
import { ProductType } from '../product/product.types';
import { WarehouseService } from './warehouse.service';
import {
	CreateWarehouseInput,
	UpdateWarehouseInput,
	WarehouseType,
} from './warehouse.types';

@Resolver(() => WarehouseType)
export class WarehouseResolver extends BaseResolver<
  WarehouseType,
  CreateWarehouseInput,
  UpdateWarehouseInput
> {
  constructor(
    protected readonly service: WarehouseService,
    private readonly companyService: CompanyService,
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
  ) {
    super(service);
  }

  @Query(() => [WarehouseType])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'OPERATOR', 'VIEWER')
  async warehouses(@CurrentCompany() companyId: string) {
    return this.service.findAllByCompany(companyId);
  }

  @Query(() => WarehouseType, { nullable: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'OPERATOR', 'VIEWER')
  async warehouse(@Args('id') id: string, @CurrentCompany() companyId: string) {
    const warehouse = await super.findOne(id);
    return warehouse && warehouse.companyId === companyId ? warehouse : null;
  }

  @Mutation(() => WarehouseType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'OPERATOR')
  async createWarehouse(
    @Args('input', { type: () => CreateWarehouseInput })
    input: CreateWarehouseInput,
    @CurrentCompany() companyId: string,
  ) {
    return super.create({ ...input, companyId });
  }

  @Mutation(() => WarehouseType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'OPERATOR')
  async updateWarehouse(
    @Args('id') id: string,
    @Args('input', { type: () => UpdateWarehouseInput })
    input: UpdateWarehouseInput,
    @CurrentCompany() companyId: string,
  ) {
    return super.update(id, { ...input, companyId });
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  async softDeleteWarehouse(
    @Args('id') id: string,
    @CurrentCompany() companyId: string,
  ) {
    const warehouse = await super.findOne(id);
    if (!warehouse || warehouse.companyId !== companyId)
      throw new Error('Forbidden');
    await super.softDelete(id);
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  async deleteWarehouse(
    @Args('id') id: string,
    @CurrentCompany() companyId: string,
  ) {
    const warehouse = await super.findOne(id);
    if (!warehouse || warehouse.companyId !== companyId)
      throw new Error('Forbidden');
    await super.delete(id);
    return true;
  }

  @ResolveField(() => CompanyType, { nullable: true })
  async company(@Parent() warehouse: WarehouseType) {
    return this.companyService.findById(warehouse.companyId);
  }

  @ResolveField(() => [OrderType])
  async orders(@Parent() warehouse: WarehouseType) {
    return this.orderService.findAllByWarehouse(warehouse.id);
  }

  @ResolveField(() => [ProductType])
  async products(@Parent() warehouse: WarehouseType) {
    return this.productService.findAllByWarehouse(warehouse.id);
  }
}
