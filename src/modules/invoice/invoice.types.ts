import { BaseObjectType } from 'src/shared/types/base.type';
import { z } from 'zod';

import { Field, InputType, ObjectType } from '@nestjs/graphql';

import { OrderType } from '../order/order.types';

export const createInvoiceSchema = z.object({
  orderId: z.uuid(),
  invoiceNumber: z.string().min(1).max(100),
  issueDate: z.coerce.date().optional(),
});

export const updateInvoiceSchema = createInvoiceSchema.partial();

export type CreateInvoice = z.infer<typeof createInvoiceSchema>;
export type UpdateInvoice = z.infer<typeof updateInvoiceSchema>;

@ObjectType()
export class InvoiceType extends BaseObjectType {
  @Field()
  orderId: string;

  @Field()
  invoiceNumber: string;

  @Field()
  issueDate: Date;

  @Field(() => OrderType, { nullable: true })
  order?: OrderType;
}

@InputType()
export class CreateInvoiceInput {
  @Field()
  orderId: string;

  @Field()
  invoiceNumber: string;

  @Field({ nullable: true })
  issueDate?: Date;
}

@InputType()
export class UpdateInvoiceInput {
  @Field({ nullable: true })
  orderId?: string;

  @Field({ nullable: true })
  invoiceNumber?: string;

  @Field({ nullable: true })
  issueDate?: Date;
}
