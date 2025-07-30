import { BaseEntity } from 'src/shared/entities/base.entity';
import { OrderType } from 'src/shared/enums/order-type.enum';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'order' })
export class Order extends BaseEntity {
  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @Column({ name: 'warehouse_id', type: 'uuid' })
  warehouseId: string;

  @Column({ name: 'partner_id', type: 'uuid' })
  partnerId: string;

  @Column({ type: 'timestamptz', default: () => 'now()' })
  date: Date;

  @Column({ name: 'type', type: 'enum', enum: OrderType })
  type: OrderType;
}
