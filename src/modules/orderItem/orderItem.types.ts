import { BaseObjectType } from 'src/shared/types/base.type';
import { z } from 'zod';

import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { OrderType } from '../order/order.types';
import { ProductType } from '../product/product.types';

export const createOrderItemSchema = z.object({
  productId: z.uuid(),
  orderId: z.uuid(),
  quantity: z.number().int().positive(),
  priceAtOrder: z.number().nonnegative(),
});

export const updateOrderItemSchema = createOrderItemSchema.partial();

export type CreateOrderItem = z.infer<typeof createOrderItemSchema>;
export type UpdateOrderItem = z.infer<typeof updateOrderItemSchema>;

@ObjectType()
export class OrderItemType extends BaseObjectType {
  @Field()
  productId: string;

  @Field()
  orderId: string;

  @Field()
  quantity: number;

  @Field()
  priceAtOrder: number;

  @Field(() => ProductType, { nullable: true })
  product?: ProductType;

  @Field(() => OrderType, { nullable: true })
  order?: OrderType;
}

@InputType()
export class CreateOrderItemInput {
  @Field()
  productId: string;

  @Field()
  orderId: string;

  @Field()
  quantity: number;

  @Field()
  priceAtOrder: number;
}

@InputType()
export class UpdateOrderItemInput {
  @Field({ nullable: true })
  productId?: string;

  @Field({ nullable: true })
  orderId?: string;

  @Field({ nullable: true })
  quantity?: number;

  @Field({ nullable: true })
  priceAtOrder?: number;
}
