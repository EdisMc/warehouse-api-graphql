import { BaseEntity } from 'src/shared/entities/base.entity';
import { SupportType } from 'src/shared/enums/support-type.enum';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'product' })
export class Product extends BaseEntity {
  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @Column({ name: 'warehouse_id', type: 'uuid' })
  warehouseId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  sku: string;

  @Column({ name: 'prod_type', type: 'enum', enum: SupportType })
  prodType: SupportType;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  price: number;
}
