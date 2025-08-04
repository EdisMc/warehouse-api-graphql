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
import { UserService } from './user.service';
import { CreateUserInput, UpdateUserInput, UserType } from './user.types';

@Resolver(() => UserType)
export class UserResolver extends BaseResolver<
  UserType,
  CreateUserInput,
  UpdateUserInput
> {
  constructor(
    protected readonly service: UserService,
    private readonly companyService: CompanyService,
  ) {
    super(service);
  }

  @Query(() => [UserType])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'OPERATOR')
  async users(@CurrentCompany() companyId: string) {
    return this.service.getAllByCompany(companyId);
  }

  @Query(() => UserType, { nullable: true })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER', 'OPERATOR', 'VIEWER')
  async user(@Args('id') id: string, @CurrentCompany() companyId: string) {
    const user = await super.findOne(id);
    return user && user.companyId === companyId ? user : null;
  }

  @Mutation(() => UserType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  async createUser(
    @Args('input', { type: () => CreateUserInput }) input: CreateUserInput,
    @CurrentCompany() companyId: string,
  ) {
    return super.create({ ...input, companyId });
  }

  @Mutation(() => UserType)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  async updateUser(
    @Args('id') id: string,
    @Args('input', { type: () => UpdateUserInput }) input: UpdateUserInput,
    @CurrentCompany() companyId: string,
  ) {
    return super.update(id, { ...input, companyId });
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  async softDeleteUser(
    @Args('id') id: string,
    @CurrentCompany() companyId: string,
  ) {
    const user = await super.findOne(id);
    if (!user || user.companyId !== companyId) throw new Error('Forbidden');
    await super.softDelete(id);
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('OWNER')
  async deleteUser(
    @Args('id') id: string,
    @CurrentCompany() companyId: string,
  ) {
    const user = await super.findOne(id);
    if (!user || user.companyId !== companyId) throw new Error('Forbidden');
    await super.delete(id);
    return true;
  }

  @ResolveField(() => CompanyType, { nullable: true })
  async company(@Parent() user: UserType) {
    return this.companyService.findById(user.companyId);
  }
}
