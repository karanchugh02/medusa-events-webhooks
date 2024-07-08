import { SubscriberArgs, SubscriberConfig } from "@medusajs/medusa";
export default function orderEventsWebhookHandler({ data, eventName, container, }: SubscriberArgs<any>): Promise<void>;
export declare const config: SubscriberConfig;
