import { BaseEntity, BeforeInsert, Column, Entity } from "typeorm";
import { SoftDeletableEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils";

@Entity({ name: "event_webhooks" })
export default class EventWebhooks extends SoftDeletableEntity {
  @Column({ type: "varchar", nullable: false })
  webhook_url: string;

  @Column({ type: "json", nullable: false, default: [] })
  event_types: string[];

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "event_webhooks");
  }
}
