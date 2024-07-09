import {
  BaseEntity,
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { SoftDeletableEntity } from "@medusajs/medusa";
import { generateEntityId } from "@medusajs/medusa/dist/utils";

@Entity({ name: "event_webhooks" })
export default class EventWebhooks {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ type: "varchar", nullable: false, unique: true })
  webhook_url: string;

  @Column({ type: "json", nullable: false, default: [] })
  event_types: string[];

  @Column({ type: "boolean", nullable: false, default: true })
  active: boolean;

  @Column({ type: "varchar" })
  access_key: string;

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date;

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date;

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "event_webhooks");
  }
}
