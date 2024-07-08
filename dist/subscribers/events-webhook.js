"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const medusa_1 = require("@medusajs/medusa");
const event_webhooks_1 = __importDefault(require("../models/event-webhooks"));
const services_1 = require("@medusajs/medusa/dist/services");
async function orderEventsWebhookHandler({ data, eventName, container, }) {
    const manager = container.resolve("manager");
    const eventWebhookRepo_ = manager.getRepository(event_webhooks_1.default);
    let eventsDataService = container.resolve("eventsDataService");
    let parsedData = await eventsDataService.fetchData(eventName, data);
    let webhooks = await eventWebhookRepo_.find({ where: {} });
    webhooks = webhooks.filter((a) => a.event_types.includes(eventName));
    await Promise.all(webhooks.map(async (wh) => {
        let url = wh.webhook_url;
        let res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ event: eventName, data: parsedData }),
        });
    }));
    return;
}
exports.default = orderEventsWebhookHandler;
exports.config = {
    event: [
        ...Object.values(medusa_1.OrderService.Events),
        ...Object.values(medusa_1.CartService.Events),
        ...Object.values(services_1.PaymentService.Events),
        ...Object.values(services_1.CustomerService.Events),
    ],
    context: {
        subscriberId: "events-webhook",
    },
};
