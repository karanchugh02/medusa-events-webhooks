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
import EventWebhookService from "../services/event-webhook";
import axios from "axios";

export default async function orderEventsWebhookHandler({
  data,
  eventName,
  container,
}: SubscriberArgs<any>) {
  const manager: EntityManager = container.resolve("manager");
  const eventWebhookRepo_ = manager.getRepository(EventWebhooks);
  let eventsDataService: EventsDataService =
    container.resolve("eventsDataService");

  let eventWebhookService: EventWebhookService = container.resolve(
    "eventWebhookService"
  );
  let parsedData = await eventsDataService.fetchData(eventName, data);

  let webhooks = await eventWebhookService.getAllWebhooks();
  webhooks = webhooks.filter(
    (a) => a.event_types.includes(eventName) && a.active
  );

  webhooks.map((wh) => {
    let url = wh.webhook_url;
    axios
      .post(url, JSON.stringify({ event: eventName, data: parsedData }), {
        headers: {
          "Content-Type": "application/json",
          "X-ACCESS_KEY": wh.access_key,
        },
      })
      .then(() => {})
      .catch((e) => {});
  });

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
