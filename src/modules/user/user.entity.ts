import { BaseEntity } from 'src/shared/entities/base.entity';
import { UserRoleEnum } from 'src/shared/enums/user-role.enum';
import { Column, Entity } from 'typeorm';

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'enum', enum: UserRoleEnum, default: UserRoleEnum.VIEWER })
  role: UserRoleEnum;
}
