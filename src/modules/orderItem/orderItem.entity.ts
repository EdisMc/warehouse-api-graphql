import { BaseEntity } from 'src/shared/entities/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'order_item' })
export class OrderItem extends BaseEntity {
  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;

  @Column({ type: 'integer' })
  quantity: number;

  @Column({ name: 'price_at_order', type: 'numeric', precision: 12, scale: 2 })
  priceAtOrder: number;
}
