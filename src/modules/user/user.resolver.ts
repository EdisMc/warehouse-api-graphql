import { BaseResolver } from 'src/shared/resolvers/base.resolver';

import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

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

  @ResolveField(() => CompanyType, { nullable: true })
  async company(@Parent() user: UserType) {
    return this.companyService.findById(user.companyId);
  }
}
