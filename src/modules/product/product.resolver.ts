import { CurrentCompany } from 'src/decorators/current-company.decorator';
import { CurrentUser } from 'src/decorators/current-user.decorator';
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
import { OrderItemService } from '../orderItem/orderItem.service';
import { OrderItemType } from '../orderItem/orderItem.types';
import { UserType } from '../user/user.types';
import { WarehouseService } from '../warehouse/warehouse.service';
import { WarehouseType } from '../warehouse/warehouse.types';
import { ProductService } from './product.service';
import {
	CreateProductInput,
	ProductType,
	UpdateProductInput,
} from './product.types';

@Resolver(() => ProductType)
export class ProductResolver extends BaseResolver<
  ProductType,
  CreateProductInput,
  UpdateProductInput
> {
  constructor(
    protected readonly service: ProductService,
    private readonly companyService: CompanyService,
    private readonly warehouseService: WarehouseService,
    private readonly orderItemService: OrderItemService,
  ) {
    super(service);
  }

  @Query(() => [ProductType])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'OPERATOR', 'VIEWER')
  async products(@CurrentCompany() companyId: string) {
    return this.service.findAllByCompany(companyId);
  }

  @Query(() => ProductType, { nullable: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'OPERATOR', 'VIEWER')
  async product(@Args('id') id: string, @CurrentCompany() companyId: string) {
    const product = await super.findOne(id);
    return product && product.companyId === companyId ? product : null;
  }

  @Mutation(() => ProductType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'OPERATOR')
  async createProduct(
    @Args('input', { type: () => CreateProductInput })
    input: CreateProductInput,
    @CurrentUser() user: UserType,
    @CurrentCompany() companyId: string,
  ) {
    const inputWithCompany = { ...input, companyId };
    return this.service.create(inputWithCompany, user.id);
  }

  @Mutation(() => ProductType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'OPERATOR')
  async updateProduct(
    @Args('id') id: string,
    @Args('input', { type: () => UpdateProductInput })
    input: UpdateProductInput,
    @CurrentCompany() companyId: string,
  ) {
    return super.update(id, { ...input, companyId });
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  async softDeleteProduct(
    @Args('id') id: string,
    @CurrentCompany() companyId: string,
  ) {
    const product = await super.findOne(id);
    if (!product || product.companyId !== companyId)
      throw new Error('Forbidden');
    await super.softDelete(id);
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  async deleteProduct(
    @Args('id') id: string,
    @CurrentCompany() companyId: string,
  ) {
    const product = await super.findOne(id);
    if (!product || product.companyId !== companyId)
      throw new Error('Forbidden');
    await super.delete(id);
    return true;
  }

  @ResolveField(() => CompanyType, { nullable: true })
  async company(@Parent() product: ProductType) {
    return this.companyService.findById(product.companyId);
  }

  @ResolveField(() => WarehouseType, { nullable: true })
  async warehouse(@Parent() product: ProductType) {
    return this.warehouseService.findById(product.warehouseId);
  }

  @ResolveField(() => [OrderItemType])
  async orderItems(@Parent() product: ProductType) {
    return this.orderItemService.findAllByProduct(product.id);
  }
}
