import { SoftDeletableEntity } from "@medusajs/medusa";
export default class EventWebhooks extends SoftDeletableEntity {
    webhook_url: string;
    event_types: string[];
    private beforeInsert;
}
