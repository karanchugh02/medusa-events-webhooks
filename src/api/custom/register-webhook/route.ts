import { Logger, MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { EntityManager } from "typeorm";
import EventWebhooks from "../../../models/event-webhooks";
import { createHash } from "crypto";
import EventWebhookService from "../../../services/event-webhook";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const logger = req.scope.resolve("logger") as Logger;

  try {
    logger.debug(`webhook url and events : ${JSON.stringify(req.body)}`);
    let eventWebhookService: EventWebhookService = req.scope.resolve(
      "eventWebhookService"
    );
    let newWebhook = await eventWebhookService.create(req.body);
    return res.status(200).json({ status: true, data: newWebhook });
  } catch (err) {
    logger.error("Error authorizing google:", err);
    return res.status(500).json({ status: false, message: err.message });
  }
};
