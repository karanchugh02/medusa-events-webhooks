import { dataSource } from "@medusajs/medusa/dist/loaders/database";
import EventWebhooks from "../models/event-webhooks";

console.log("data source ", dataSource);
export const EventWebhooksRepository = dataSource.getRepository(EventWebhooks);

export default EventWebhooksRepository;
