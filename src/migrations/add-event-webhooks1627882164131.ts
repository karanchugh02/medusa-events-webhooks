import { MigrationInterface, QueryRunner } from "typeorm";

export class addEventWebhooks1627882164131 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE event_webhooks (
        id VARCHAR(255) PRIMARY KEY,
        webhook_url VARCHAR(255) NOT NULL,
        event_types JSON NOT NULL DEFAULT '[]',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        deleted_at TIMESTAMP NULL
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE event_webhooks;
    `);
  }
}
