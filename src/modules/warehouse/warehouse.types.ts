import { SupportType } from 'src/shared/enums/support-type.enum';
import { BaseObjectType } from 'src/shared/types/base.type';
import { z } from 'zod';

import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { CompanyType } from '../company/company.types';
import { OrderType } from '../order/order.types';
import { ProductType } from '../product/product.types';

export const createWarehouseSchema = z.object({
  companyId: z.uuid(),
  name: z.string().min(2).max(64),
  location: z.string().min(2).max(128),
  supportType: z.enum([SupportType.SOLID, SupportType.LIQUID]),
});

export const updateWarehouseSchema = createWarehouseSchema.partial();

export type CreateWarehouse = z.infer<typeof createWarehouseSchema>;
export type UpdateWarehouse = z.infer<typeof updateWarehouseSchema>;

@ObjectType()
export class WarehouseType extends BaseObjectType {
  @Field()
  companyId: string;

  @Field()
  name: string;

  @Field()
  location: string;

  @Field(() => SupportType)
  supportType: SupportType;

  @Field(() => CompanyType, { nullable: true })
  company?: CompanyType;

  @Field(() => [OrderType])
  orders?: OrderType[];

  @Field(() => [ProductType])
  products?: ProductType[];
}

@InputType()
export class CreateWarehouseInput {
  @Field()
  companyId: string;

  @Field()
  name: string;

  @Field()
  location: string;

  @Field(() => SupportType)
  supportType: SupportType;
}

@InputType()
export class UpdateWarehouseInput {
  @Field({ nullable: true })
  companyId?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  location?: string;

  @Field(() => SupportType, { nullable: true })
  supportType?: SupportType;
}
