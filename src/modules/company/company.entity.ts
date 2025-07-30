import { BaseEntity } from 'src/shared/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'company' })
export class Company extends BaseEntity {
  @Column({ type: 'varchar', length: 255, unique: true })
  name: string;
}
