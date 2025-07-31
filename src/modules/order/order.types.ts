import { OrderTypeEnum } from 'src/shared/enums/order-type.enum';
import { BaseObjectType } from 'src/shared/types/base.type';
import { z } from 'zod';

import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { CompanyType } from '../company/company.types';
import { InvoiceType } from '../invoice/invoice.types';
import { OrderItemType } from '../orderItem/orderItem.types';
import { PartnerType } from '../partner/partner.types';
import { WarehouseType } from '../warehouse/warehouse.types';

export const createOrderSchema = z.object({
  companyId: z.uuid(),
  warehouseId: z.uuid(),
  partnerId: z.uuid(),
  date: z.coerce.date(),
  type: z.enum([OrderTypeEnum.DELIVERY, OrderTypeEnum.SHIPMENT]),
});

export const updateOrderSchema = createOrderSchema.partial();

export type CreateOrder = z.infer<typeof createOrderSchema>;
export type UpdateOrder = z.infer<typeof updateOrderSchema>;

@ObjectType()
export class OrderType extends BaseObjectType {
  @Field()
  companyId: string;

  @Field()
  warehouseId: string;

  @Field()
  partnerId: string;

  @Field()
  date: Date;

  @Field(() => OrderTypeEnum)
  type: OrderTypeEnum;

  @Field(() => CompanyType, { nullable: true })
  company?: CompanyType;

  @Field(() => PartnerType, { nullable: true })
  partner?: PartnerType;

  @Field(() => WarehouseType, { nullable: true })
  warehouse?: WarehouseType;

  @Field(() => [OrderItemType])
  orderItems?: OrderItemType[];

  @Field(() => InvoiceType, { nullable: true })
  invoice?: InvoiceType;
}

@InputType()
export class CreateOrderInput {
  @Field()
  companyId: string;

  @Field()
  warehouseId: string;

  @Field()
  partnerId: string;

  @Field()
  date: Date;

  @Field(() => OrderTypeEnum)
  type: OrderTypeEnum;
}

@InputType()
export class UpdateOrderInput {
  @Field({ nullable: true })
  companyId?: string;

  @Field({ nullable: true })
  warehouseId?: string;

  @Field({ nullable: true })
  partnerId?: string;

  @Field({ nullable: true })
  date?: Date;

  @Field(() => OrderTypeEnum, { nullable: true })
  type?: OrderTypeEnum;
}
