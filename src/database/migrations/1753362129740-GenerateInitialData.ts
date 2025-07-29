import { MigrationInterface, QueryRunner } from 'typeorm';

export class GenerateInitialData1753362129740 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      INSERT INTO "company" ("id", "name")
      VALUES
        ('71079f99-6101-4d6b-ad4d-f6a86b4d3d31', 'Acme Corp'),
        ('b2e8c7e2-2e2b-4b2a-9e2b-2e2b4b2a9e2b', 'Tech Solutions'),
        ('c3f8e7d6-3e3b-4c3a-8e3b-3e3b4c3a8e3b', 'Green Energy Ltd.');
    `);

    await queryRunner.query(`
      INSERT INTO "user" ("id", "name", "email", "password", "role", "company_id")
      VALUES
        ('a1b2c3d4-1111-4222-8333-444455556666', 'Ivan Ivanov', 'ivan@acme.com', '$2a$10$8w7Qn3b8QwQ1QwQ1QwQ1QeQwQ1QwQ1QwQ1QwQ1QwQ1QwQ1QwQ1Q', 'OWNER', '71079f99-6101-4d6b-ad4d-f6a86b4d3d31'),
        ('b2c3d4e5-2222-4333-9444-555566667777', 'Maria Petrova', 'maria@acme.com', '$2a$10$4v8Qn3b8QwQ1QwQ1QwQ1QeQwQ1QwQ1QwQ1QwQ1QwQ1QwQ1QwQ1Q', 'OPERATOR', '71079f99-6101-4d6b-ad4d-f6a86b4d3d31'),
        ('c3d4e5f6-3333-4444-9555-666677778888', 'Georgi Georgiev', 'georgi@techsolutions.com', '$2a$10$7w8Qn3b8QwQ1QwQ1QwQ1QeQwQ1QwQ1QwQ1QwQ1QwQ1QwQ1QwQ1Q', 'VIEWER', 'b2e8c7e2-2e2b-4b2a-9e2b-2e2b4b2a9e2b'),
        ('d4e5f6a7-4444-5555-9666-777788889999', 'Petar Petrov', 'petar@greenenergy.com', '$2a$10$8w7Qn3b8QwQ1QwQ1QwQ1QeQwQ1QwQ1QwQ1QwQ1QwQ1QwQ1QwQ1Q', 'OPERATOR', 'c3f8e7d6-3e3b-4c3a-8e3b-3e3b4c3a8e3b');
    `);

    await queryRunner.query(`
      INSERT INTO "warehouse" ("id", "name", "location", "support_type", "company_id", "modified_by")
      VALUES
        ('d4e5f6a7-4444-5555-9666-777788889999', 'Central Warehouse', 'Sofia', 'solid', '71079f99-6101-4d6b-ad4d-f6a86b4d3d31', 'a1b2c3d4-1111-4222-8333-444455556666'),
        ('e5f6a7b8-5555-6666-9777-888899990000', 'Plovdiv Depot', 'Plovdiv', 'liquid', 'b2e8c7e2-2e2b-4b2a-9e2b-2e2b4b2a9e2b', 'b2c3d4e5-2222-4333-9444-555566667777'),
        ('f6a7b8c9-6666-7777-9888-999900001111', 'Varna Storage', 'Varna', 'solid', 'c3f8e7d6-3e3b-4c3a-8e3b-3e3b4c3a8e3b', 'd4e5f6a7-4444-5555-9666-777788889999');
    `);

    await queryRunner.query(`
      INSERT INTO "product" ("id", "name", "sku", "prod_type", "price", "company_id", "warehouse_id", "modified_by")
      VALUES
        ('f6a7b8c9-6666-7777-9888-999900001111', 'Laptop Lenovo ThinkPad', 'LTP-001', 'solid', 1800.00, '71079f99-6101-4d6b-ad4d-f6a86b4d3d31', 'd4e5f6a7-4444-5555-9666-777788889999', 'a1b2c3d4-1111-4222-8333-444455556666'),
        ('a7b8c9d0-7777-8888-9999-000011112222', 'Wireless Mouse Logitech', 'MSE-002', 'solid', 45.50, '71079f99-6101-4d6b-ad4d-f6a86b4d3d31', 'd4e5f6a7-4444-5555-9666-777788889999', 'a1b2c3d4-1111-4222-8333-444455556666'),
        ('b8c9d0e1-8888-9999-0000-111122223333', 'Engine Oil', 'OIL-004', 'liquid', 32.00, 'b2e8c7e2-2e2b-4b2a-9e2b-2e2b4b2a9e2b', 'e5f6a7b8-5555-6666-9777-888899990000', 'b2c3d4e5-2222-4333-9444-555566667777'),
        ('c9d0e1f2-9999-0000-1111-222233334445', 'Antifreeze Coolant', 'COOL-005', 'liquid', 28.00, 'b2e8c7e2-2e2b-4b2a-9e2b-2e2b4b2a9e2b', 'e5f6a7b8-5555-6666-9777-888899990000', 'b2c3d4e5-2222-4333-9444-555566667777'),
        ('d0e1f2a3-1111-2222-3333-444455556677', 'Solar Panel', 'SOL-006', 'solid', 350.00, 'c3f8e7d6-3e3b-4c3a-8e3b-3e3b4c3a8e3b', 'f6a7b8c9-6666-7777-9888-999900001111', 'd4e5f6a7-4444-5555-9666-777788889999'),
        ('e1f2a3b4-2222-3333-4444-555566667788', 'Wind Turbine Oil', 'WTO-007', 'liquid', 120.00, 'c3f8e7d6-3e3b-4c3a-8e3b-3e3b4c3a8e3b', 'f6a7b8c9-6666-7777-9888-999900001111', 'd4e5f6a7-4444-5555-9666-777788889999');
    `);

    await queryRunner.query(`
      INSERT INTO "partner" ("id", "name", "type", "company_id", "modified_by")
      VALUES
        ('f2a3b4c5-9999-0000-1111-222233334444', 'BG Electronics', 'customer', '71079f99-6101-4d6b-ad4d-f6a86b4d3d31', 'a1b2c3d4-1111-4222-8333-444455556666'),
        ('a3b4c5d6-0000-1111-2222-333344445555', 'Office Supplies Ltd.', 'supplier', 'b2e8c7e2-2e2b-4b2a-9e2b-2e2b4b2a9e2b', 'b2c3d4e5-2222-4333-9444-555566667777'),
        ('b4c5d6e7-3333-4444-5555-666677778899', 'Eco Energy Partners', 'customer', 'c3f8e7d6-3e3b-4c3a-8e3b-3e3b4c3a8e3b', 'd4e5f6a7-4444-5555-9666-777788889999'),
        ('c5d6e7f8-4444-5555-6666-777788889900', 'Green Supplies', 'supplier', 'c3f8e7d6-3e3b-4c3a-8e3b-3e3b4c3a8e3b', 'd4e5f6a7-4444-5555-9666-777788889999');
    `);

    await queryRunner.query(`
      INSERT INTO "order" ("id", "company_id", "warehouse_id", "partner_id", "date", "type", "modified_by")
      VALUES
        ('d6e7f8a9-1111-2222-3333-444455556666', '71079f99-6101-4d6b-ad4d-f6a86b4d3d31', 'd4e5f6a7-4444-5555-9666-777788889999', 'f2a3b4c5-9999-0000-1111-222233334444', NOW(), 'shipment', 'a1b2c3d4-1111-4222-8333-444455556666'),
        ('e7f8a9b0-2222-3333-4444-555566667777', 'b2e8c7e2-2e2b-4b2a-9e2b-2e2b4b2a9e2b', 'e5f6a7b8-5555-6666-9777-888899990000', 'a3b4c5d6-0000-1111-2222-333344445555', NOW(), 'delivery', 'b2c3d4e5-2222-4333-9444-555566667777'),
        ('f8a9b0c1-3333-4444-5555-666677778888', 'c3f8e7d6-3e3b-4c3a-8e3b-3e3b4c3a8e3b', 'f6a7b8c9-6666-7777-9888-999900001111', 'b4c5d6e7-3333-4444-5555-666677778899', NOW(), 'shipment', 'd4e5f6a7-4444-5555-9666-777788889999'),
        ('a9b0c1d2-4444-5555-6666-777788889999', 'c3f8e7d6-3e3b-4c3a-8e3b-3e3b4c3a8e3b', 'f6a7b8c9-6666-7777-9888-999900001111', 'c5d6e7f8-4444-5555-6666-777788889900', NOW(), 'delivery', 'd4e5f6a7-4444-5555-9666-777788889999'),
        ('b0c1d2e3-5555-6666-7777-888899990000', '71079f99-6101-4d6b-ad4d-f6a86b4d3d31', 'd4e5f6a7-4444-5555-9666-777788889999', 'f2a3b4c5-9999-0000-1111-222233334444', NOW(), 'shipment', 'a1b2c3d4-1111-4222-8333-444455556666');
    `);

    await queryRunner.query(`
      INSERT INTO "order_item" ("id", "product_id", "order_id", "quantity", "price_at_order", "modified_by")
      VALUES
        ('c1d2e3f4-5555-6666-7777-888899990001', 'f6a7b8c9-6666-7777-9888-999900001111', 'd6e7f8a9-1111-2222-3333-444455556666', 3, 1700.00, 'a1b2c3d4-1111-4222-8333-444455556666'),
        ('d2e3f4a5-6666-7777-8888-999900001112', 'b8c9d0e1-8888-9999-0000-111122223333', 'e7f8a9b0-2222-3333-4444-555566667777', 5, 35.00, 'b2c3d4e5-2222-4333-9444-555566667777'),   
        ('e3f4a5b6-7777-8888-9999-000011112223', 'd0e1f2a3-1111-2222-3333-444455556677', 'f8a9b0c1-3333-4444-5555-666677778888', 2, 340.00, 'd4e5f6a7-4444-5555-9666-777788889999'), 
        ('f4a5b6c7-8888-9999-0000-111122223334', 'e1f2a3b4-2222-3333-4444-555566667788', 'a9b0c1d2-4444-5555-6666-777788889999', 1, 130.00, 'd4e5f6a7-4444-5555-9666-777788889999'), 
        ('a5b6c7d8-9999-0000-1111-222233334445', 'a7b8c9d0-7777-8888-9999-000011112222', 'b0c1d2e3-5555-6666-7777-888899990000', 10, 50.00, 'a1b2c3d4-1111-4222-8333-444455556666'), 
        ('b6c7d8e9-0000-1111-2222-333344445556', 'c9d0e1f2-9999-0000-1111-222233334445', 'f8a9b0c1-3333-4444-5555-666677778888', 4, 25.00, 'd4e5f6a7-4444-5555-9666-777788889999'),
        ('c7d8e9f0-1111-2222-3333-444455556667', 'f6a7b8c9-6666-7777-9888-999900001111', 'a9b0c1d2-4444-5555-6666-777788889999', 1, 1850.00, 'd4e5f6a7-4444-5555-9666-777788889999'); 
    `);

    await queryRunner.query(`
      INSERT INTO "invoice" ("id", "order_id", "invoice_number", "issue_date", "modified_by")
      VALUES
        ('d8e9f0a1-2222-3333-4444-555566667778', 'd6e7f8a9-1111-2222-3333-444455556666', 'INV-2025-0001', NOW(), 'a1b2c3d4-1111-4222-8333-444455556666'),
        ('e9f0a1b2-3333-4444-5555-666677778889', 'e7f8a9b0-2222-3333-4444-555566667777', 'INV-2025-0002', NOW(), 'b2c3d4e5-2222-4333-9444-555566667777'),
        ('f0a1b2c3-4444-5555-6666-777788889900', 'f8a9b0c1-3333-4444-5555-666677778888', 'INV-2025-0003', NOW(), 'd4e5f6a7-4444-5555-9666-777788889999'),
        ('a1b2c3d4-5555-6666-7777-888899990011', 'a9b0c1d2-4444-5555-6666-777788889999', 'INV-2025-0004', NOW(), 'd4e5f6a7-4444-5555-9666-777788889999'),
        ('b2c3d4e5-6666-7777-8888-999900001122', 'b0c1d2e3-5555-6666-7777-888899990000', 'INV-2025-0005', NOW(), 'a1b2c3d4-1111-4222-8333-444455556666');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM "invoice";`);
    await queryRunner.query(`DELETE FROM "order_item";`);
    await queryRunner.query(`DELETE FROM "order";`);
    await queryRunner.query(`DELETE FROM "partner";`);
    await queryRunner.query(`DELETE FROM "product";`);
    await queryRunner.query(`DELETE FROM "warehouse";`);
    await queryRunner.query(`DELETE FROM "user";`);
    await queryRunner.query(`DELETE FROM "company";`);
  }
}
