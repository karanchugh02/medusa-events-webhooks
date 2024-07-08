import {
  CartService,
  OrderService,
  SubscriberArgs,
  SubscriberConfig,
} from "@medusajs/medusa";
import EventsDataService from "../services/events-data";
import { EntityManager } from "typeorm";
import EventWebhooks from "../models/event-webhooks";
import {
  CustomerService,
  PaymentService,
} from "@medusajs/medusa/dist/services";

export default async function orderEventsWebhookHandler({
  data,
  eventName,
  container,
}: SubscriberArgs<any>) {
  const manager: EntityManager = container.resolve("manager");
  const eventWebhookRepo_ = manager.getRepository(EventWebhooks);
  let eventsDataService: EventsDataService =
    container.resolve("eventsDataService");

  let parsedData = await eventsDataService.fetchData(eventName, data);

  let webhooks = await eventWebhookRepo_.find({ where: {} });
  webhooks = webhooks.filter((a) => a.event_types.includes(eventName));

  await Promise.all(
    webhooks.map(async (wh) => {
      let url = wh.webhook_url;
      let res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ event: eventName, data: parsedData }),
      });
    })
  );

  return;
}

export const config: SubscriberConfig = {
  event: [
    ...Object.values(OrderService.Events),
    ...Object.values(CartService.Events),
    ...Object.values(PaymentService.Events),
    ...Object.values(CustomerService.Events),
  ],
  context: {
    subscriberId: "events-webhook",
  },
};
