import {
  CartService,
  OrderService,
  SubscriberArgs,
  SubscriberConfig,
} from "@medusajs/medusa";
import EventsDataService from "../services/events-data";
import {
  CustomerService,
  PaymentService,
} from "@medusajs/medusa/dist/services";
import EventWebhookService from "../services/event-webhook";
import axios from "axios";
import retry from "async-retry";

const totalTimeout = 3600000;

const sendWebhook = (
  webhookUrl: string,
  eventName: string,
  parsedData: any,
  accessKey: string,
  maxRetryCount: number
) => {
  return retry(
    async () => {
      return axios
        .post(
          webhookUrl,

          JSON.stringify({ event: eventName, data: parsedData }),
          {
            headers: {
              "Content-Type": "application/json",
              "X-ACCESS_KEY": accessKey,
            },
          }
        )
        .catch((e) => {
          throw new Error(e.message);
        });
    },

    {
      retries: maxRetryCount,
      randomize: true,
      maxRetryTime: totalTimeout,
      onRetry: (e, attempt) => {},
    }
  );
};

export default async function eventsWebhookHandler({
  data,
  eventName,
  container,
  pluginOptions,
}: SubscriberArgs<any>) {
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
    sendWebhook(
      wh.webhook_url,
      eventName,
      parsedData,
      wh.access_key,
      Number(pluginOptions.MAX_RETRY_COUNT || 10)
    );
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
