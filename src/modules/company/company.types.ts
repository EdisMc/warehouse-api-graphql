import { BaseObjectType } from 'src/shared/types/base.type';
import { z } from 'zod';

import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { OrderType } from '../order/order.types';
import { PartnerType } from '../partner/partner.types';
import { ProductType } from '../product/product.types';
import { UserType } from '../user/user.types';
import { WarehouseType } from '../warehouse/warehouse.types';

export const createCompanySchema = z.object({
  name: z.string().min(2).max(64),
});

export const updateCompanySchema = createCompanySchema.partial();

export type CreateCompany = z.infer<typeof createCompanySchema>;
export type UpdateCompany = z.infer<typeof updateCompanySchema>;

@ObjectType()
export class CompanyType extends BaseObjectType {
  @Field()
  name: string;

  @Field(() => [UserType])
  users?: UserType[];

  @Field(() => [ProductType])
  products?: ProductType[];

  @Field(() => [WarehouseType])
  warehouses?: WarehouseType[];

  @Field(() => [PartnerType])
  partners?: PartnerType[];

  @Field(() => [OrderType])
  orders?: OrderType[];
}

@InputType()
export class CreateCompanyInput {
  @Field()
  name: string;
}

@InputType()
export class UpdateCompanyInput {
  @Field({ nullable: true })
  name?: string;
}
