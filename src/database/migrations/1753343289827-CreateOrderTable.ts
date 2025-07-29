import {
	MigrationInterface,
	QueryRunner,
	Table,
	TableForeignKey,
} from 'typeorm';

export class CreateOrderTable1753343289827 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TYPE order_type_enum AS ENUM ('delivery', 'shipment')
    `);

    await queryRunner.createTable(
      new Table({
        name: 'order',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'company_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'warehouse_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'partner_id',
            type: 'uuid',
            isNullable: false,
          },
          {
            name: 'date',
            type: 'timestamptz',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'type',
            type: 'order_type_enum',
            isNullable: false,
          },
          {
            name: 'created_at',
            type: 'timestamptz',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamptz',
            isNullable: false,
            default: 'now()',
          },
          {
            name: 'deleted_at',
            type: 'timestamptz',
            isNullable: true,
          },
          {
            name: 'modified_by',
            type: 'uuid',
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'order',
      new TableForeignKey({
        columnNames: ['warehouse_id'],
        referencedTableName: 'warehouse',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'order',
      new TableForeignKey({
        columnNames: ['partner_id'],
        referencedTableName: 'partner',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'order',
      new TableForeignKey({
        columnNames: ['company_id'],
        referencedTableName: 'company',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      }),
    );

    await queryRunner.createForeignKey(
      'order',
      new TableForeignKey({
        columnNames: ['modified_by'],
        referencedTableName: 'user',
        referencedColumnNames: ['id'],
        onDelete: 'RESTRICT',
        onUpdate: 'CASCADE',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('order');
    await queryRunner.query(`DROP TYPE IF EXISTS order_type_enum`);
  }
}
