import { nullable } from 'zod';

import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class BestsellingProductType {
  @Field()
  productId: string;

  @Field()
  productName: string;

  @Field()
  totalSold: string;
}

@ObjectType()
export class TopClientType {
  @Field()
  partnerId: string;

  @Field()
  partnerName: string;

  @Field()
  ordersCount: string;
}

@ObjectType()
export class HighestStockProductType {
  @Field({ nullable: true })
  warehouseId: string;

  @Field({ nullable: true })
  warehouseName: string;

  @Field({ nullable: true })
  productId: string;

  @Field({ nullable: true })
  productName: string;

  @Field({ nullable: true })
  totalQuantity: string;
}
