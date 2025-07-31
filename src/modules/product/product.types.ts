import { SupportTypeEnum } from 'src/shared/enums/support-type.enum';
import { BaseObjectType } from 'src/shared/types/base.type';
import { z } from 'zod';

import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { CompanyType } from '../company/company.types';
import { OrderItemType } from '../orderItem/orderItem.types';
import { WarehouseType } from '../warehouse/warehouse.types';

export const createProductSchema = z.object({
  companyId: z.uuid(),
  warehouseId: z.uuid(),
  name: z.string().min(2).max(64),
  sku: z.string().min(2).max(100),
  prodType: z.enum([SupportTypeEnum.SOLID, SupportTypeEnum.LIQUID]),
  price: z.number().nonnegative(),
});

export const updateProductSchema = createProductSchema.partial();

export type CreateProduct = z.infer<typeof createProductSchema>;
export type UpdateProduct = z.infer<typeof updateProductSchema>;

@ObjectType()
export class ProductType extends BaseObjectType {
  @Field()
  companyId: string;

  @Field()
  warehouseId: string;

  @Field()
  name: string;

  @Field()
  sku: string;

  @Field(() => SupportTypeEnum)
  prodType: SupportTypeEnum;

  @Field()
  price: number;

  @Field(() => CompanyType, { nullable: true })
  company?: CompanyType;

  @Field(() => WarehouseType, { nullable: true })
  warehouse?: WarehouseType;

  @Field(() => [OrderItemType])
  orderItems?: OrderItemType[];
}

@InputType()
export class CreateProductInput {
  @Field()
  companyId: string;

  @Field()
  warehouseId: string;

  @Field()
  name: string;

  @Field()
  sku: string;

  @Field(() => SupportTypeEnum)
  prodType: SupportTypeEnum;

  @Field()
  price: number;
}

@InputType()
export class UpdateProductInput {
  @Field({ nullable: true })
  companyId?: string;

  @Field({ nullable: true })
  warehouseId?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  sku?: string;

  @Field(() => SupportTypeEnum, { nullable: true })
  prodType?: SupportTypeEnum;

  @Field({ nullable: true })
  price?: number;
}
