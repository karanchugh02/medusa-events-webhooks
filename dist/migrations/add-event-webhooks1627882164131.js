"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addEventWebhooks1627882164131 = void 0;
class addEventWebhooks1627882164131 {
    async up(queryRunner) {
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
    async down(queryRunner) {
        await queryRunner.query(`
      DROP TABLE event_webhooks;
    `);
    }
}
exports.addEventWebhooks1627882164131 = addEventWebhooks1627882164131;
