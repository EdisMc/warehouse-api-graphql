import { UserRoleEnum } from 'src/shared/enums/user-role.enum';
import { BaseObjectType } from 'src/shared/types/base.type';
import { z } from 'zod';

import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { CompanyType } from '../company/company.types';

export const createUserSchema = z.object({
  companyId: z.uuid(),
  name: z.string().min(2).max(64),
  email: z.email(),
  password: z.string().min(6).max(255),
  role: z.enum([
    UserRoleEnum.OWNER,
    UserRoleEnum.OPERATOR,
    UserRoleEnum.VIEWER,
  ]),
});

export const updateUserSchema = createUserSchema.partial();

export type CreateUser = z.infer<typeof createUserSchema>;
export type UpdateUser = z.infer<typeof updateUserSchema>; //mutacii za user - reset password, update user !!! , total na invoice ili order
//available stock v warehouses ?

@ObjectType()
export class UserType extends BaseObjectType {
  @Field()
  companyId: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field(() => UserRoleEnum)
  role: UserRoleEnum;

  @Field(() => CompanyType, { nullable: true })
  company?: CompanyType;
}

@InputType()
export class CreateUserInput {
  @Field()
  companyId: string;

  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field(() => UserRoleEnum)
  role: UserRoleEnum;
}

@InputType()
export class UpdateUserInput {
  @Field({ nullable: true })
  companyId?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  password?: string;

  @Field(() => UserRoleEnum, { nullable: true })
  role?: UserRoleEnum;
}
