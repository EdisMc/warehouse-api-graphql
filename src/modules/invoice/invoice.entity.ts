import { timestamp } from 'rxjs';
import { BaseEntity } from 'src/shared/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'invoice' })
export class Invoice extends BaseEntity {
  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;

  @Column({
    name: 'invoice_number',
    type: 'varchar',
    length: 100,
    unique: true,
  })
  invoiceNumber: string;

  @Column({ name: 'issue_date', type: 'timestamptz', default: () => 'now()' })
  issueDate: Date;
}
