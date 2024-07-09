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
    let data: any = req.body;
    let newWebhook = await eventWebhookService.updateWebhookStatus(data);
    return res.status(200).json({ status: true, data: newWebhook });
  } catch (err) {
    logger.error("Error updating webhook status:", err);
    return res.status(500).json({ status: false, message: err.message });
  }
};
