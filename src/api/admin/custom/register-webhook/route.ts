import { Logger, MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import { EntityManager } from "typeorm";
import EventWebhooks from "../../../../models/event-webhooks";
import { createHash } from "crypto";
import EventWebhookService from "../../../../services/event-webhook";

export const POST = async (req: MedusaRequest, res: MedusaResponse) => {
  const logger = req.scope.resolve("logger") as Logger;

  try {
    logger.debug(`webhook url and events : ${JSON.stringify(req.body)}`);
    let eventWebhookService: EventWebhookService = req.scope.resolve(
      "eventWebhookService"
    );
    let newWebhook = await eventWebhookService.create(req.body);
    return res.send({ status: true, data: newWebhook });
  } catch (err) {
    logger.error("Error authorizing google:", err);
    return res.send({ status: false, message: err.message });
  }
};
