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
  async users() {
    return super.findAll();
  }

  @Query(() => UserType, { nullable: true })
  async user(@Args('id') id: string) {
    return super.findOne(id);
  }

  @Mutation(() => UserType)
  async createUser(
    @Args('input', { type: () => CreateUserInput }) input: CreateUserInput,
  ) {
    return super.create(input);
  }

  @Mutation(() => UserType)
  async updateUser(
    @Args('id') id: string,
    @Args('input', { type: () => UpdateUserInput }) input: UpdateUserInput,
  ) {
    return super.update(id, input);
  }

  @Mutation(() => Boolean)
  async softDeleteUser(@Args('id') id: string) {
    return super.softDelete(id);
  }

  @Mutation(() => Boolean)
  async deleteUser(@Args('id') id: string) {
    return super.delete(id);
  }

  @ResolveField(() => CompanyType, { nullable: true })
  async company(@Parent() user: UserType) {
    return this.companyService.findById(user.companyId);
  }
}
