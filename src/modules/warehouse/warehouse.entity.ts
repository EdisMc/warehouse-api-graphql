import { BaseEntity } from 'src/shared/entities/base.entity';
import { SupportType } from 'src/shared/enums/support-type.enum';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'warehouse' })
export class Warehouse extends BaseEntity {
  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255 })
  location: string;

  @Column({ name: 'support_type', type: 'enum', enum: SupportType })
  supportType: SupportType;
}
