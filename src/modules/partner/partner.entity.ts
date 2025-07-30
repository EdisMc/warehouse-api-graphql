import { BaseEntity } from 'src/shared/entities/base.entity';
import { PartnerType } from 'src/shared/enums/partner-type.enum';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'partner' })
export class Partner extends BaseEntity {
  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'enum', enum: PartnerType })
  type: PartnerType;
}
