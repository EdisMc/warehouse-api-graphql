import { Args, Mutation, Query } from '@nestjs/graphql';

export abstract class BaseResolver<
  EntityType,
  CreateInputType,
  UpdateInputType,
> {
  constructor(protected readonly service: any) {}

  @Query(() => [Object], { name: 'findAll' })
  async findAll() {
    return this.service.getAll();
  }

  @Query(() => Object, { name: 'findOne', nullable: true })
  async findOne(@Args('id') id: string) {
    return this.service.getById(id);
  }

  @Mutation(() => Object, { name: 'create' })
  async create(@Args('input') input: CreateInputType) {
    return this.service.create(input);
  }

  @Mutation(() => Object, { name: 'update' })
  async update(@Args('id') id: string, @Args('input') input: UpdateInputType) {
    return this.service.update(id, input);
  }

  @Mutation(() => Boolean, { name: 'softDelete' })
  async softDelete(@Args('id') id: string) {
    await this.service.softDelete(id);
    return true;
  }

  @Mutation(() => Boolean, { name: 'delete' })
  async delete(@Args('id') id: string) {
    await this.service.delete(id);
    return true;
  }
}
