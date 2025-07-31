import { PartnerTypeEnum } from 'src/shared/enums/partner-type.enum';
import { BaseObjectType } from 'src/shared/types/base.type';
import { z } from 'zod';

import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { CompanyType } from '../company/company.types';
import { OrderType } from '../order/order.types';

export const createPartnerSchema = z.object({
  companyId: z.uuid(),
  name: z.string().min(2).max(64),
  type: z.enum([PartnerTypeEnum.SUPPLIER, PartnerTypeEnum.SUPPLIER]),
});

export const updatePartnerSchema = createPartnerSchema.partial();

export type CreatePartner = z.infer<typeof createPartnerSchema>;
export type UpdatePartner = z.infer<typeof updatePartnerSchema>;

@ObjectType()
export class PartnerType extends BaseObjectType {
  @Field()
  companyId: string;

  @Field()
  name: string;

  @Field(() => PartnerTypeEnum)
  type: PartnerTypeEnum;

  @Field(() => CompanyType, { nullable: true })
  company?: CompanyType;

  @Field(() => [OrderType])
  orders?: OrderType[];
}

@InputType()
export class CreatePartnerInput {
  @Field()
  companyId: string;

  @Field()
  name: string;

  @Field(() => PartnerTypeEnum)
  type: PartnerTypeEnum;
}

@InputType()
export class UpdatePartnerInput {
  @Field({ nullable: true })
  companyId?: string;

  @Field({ nullable: true })
  name?: string;

  @Field(() => PartnerTypeEnum, { nullable: true })
  type?: PartnerTypeEnum;
}
