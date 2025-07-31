export abstract class BaseResolver<
  EntityType,
  CreateInputType,
  UpdateInputType,
> {
  constructor(protected readonly service: any) {}

  async findAll(): Promise<EntityType[]> {
    return this.service.getAll();
  }

  async findOne(id: string): Promise<EntityType | null> {
    return this.service.getById(id);
  }

  async create(input: CreateInputType): Promise<EntityType> {
    return this.service.create(input);
  }

  async update(id: string, input: UpdateInputType): Promise<EntityType> {
    return this.service.update(id, input);
  }

  async softDelete(id: string): Promise<boolean> {
    await this.service.softDelete(id);
    return true;
  }

  async delete(id: string): Promise<boolean> {
    await this.service.delete(id);
    return true;
  }
}
