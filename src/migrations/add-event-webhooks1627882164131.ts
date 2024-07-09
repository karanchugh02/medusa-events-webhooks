import { MigrationInterface, QueryRunner } from "typeorm";

export class addEventWebhooks1627882164131 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE event_webhooks (
        "id" character varying NOT NULL DEFAULT gen_random_uuid(),
        webhook_url VARCHAR(255) NOT NULL,
        event_types JSON NOT NULL DEFAULT '[]',
        active BOOLEAN NOT NULL DEFAULT true,
        access_key VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        constraint "event-webhooks-pkey" primary key ("id"),
        constraint "event-webhooks-webhook_url-unique" UNIQUE ("webhook_url")
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP TABLE event_webhooks;
    `);
  }
}
