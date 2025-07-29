import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

import { Field, ID, ObjectType } from '@nestjs/graphql';

// Zod schemas
export const createCompanySchema = z.object({
  name: z.string().min(2).max(64),
});

export class CreateCompanyDto extends createZodDto(createCompanySchema) {}

export const updateCompanySchema = createCompanySchema.partial();

export class UpdateCompanyDto extends createZodDto(updateCompanySchema) {}

// GraphQL output type
@ObjectType()
export class CompanyType {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;
}
