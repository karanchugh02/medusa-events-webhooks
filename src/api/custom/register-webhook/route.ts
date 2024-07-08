import { Logger, MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { EntityManager } from "typeorm";
import EventWebhooks from "../../../models/event-webhooks";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const logger = req.scope.resolve("logger") as Logger;

  try {
    logger.debug(`webhook url and events : ${JSON.stringify(req.body)}`);
    let data: any = req.body;
    const manager: EntityManager = req.scope.resolve("manager");
    const eventWebhookRepo_ = manager.getRepository(EventWebhooks);
    let newWebhook = await eventWebhookRepo_.save({
      webhook_url: data.webhook_url,
      event_types: data.event_types,
    });

    return res.status(200).json({ status: true, data: newWebhook });
  } catch (err) {
    logger.error("Error authorizing google:", err);
    return res.status(500).json({ status: false, message: err.message });
  }
};
