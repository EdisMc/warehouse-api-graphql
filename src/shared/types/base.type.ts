import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export abstract class BaseObjectType {
  @Field(() => ID)
  id!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field({ nullable: true })
  deletedAt?: Date;

  @Field({ nullable: true })
  modifiedById?: string;
}
