import { Logger, MedusaRequest, MedusaResponse } from "@medusajs/medusa";
import EventWebhookService from "../../../services/event-webhook";

export const GET = async (req: MedusaRequest, res: MedusaResponse) => {
  const logger = req.scope.resolve("logger") as Logger;

  try {
    logger.debug(`webhook url and events : ${JSON.stringify(req.body)}`);
    let eventWebhookService: EventWebhookService = req.scope.resolve(
      "eventWebhookService"
    );
    let webhooks = await eventWebhookService.getAllWebhooks();
    return res.send({ status: true, data: webhooks });
  } catch (err) {
    logger.error("Error authorizing google:", err);
    return res.send({ status: false, message: err.message });
  }
};
