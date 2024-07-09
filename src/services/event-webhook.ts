import { TransactionBaseService } from "@medusajs/medusa";
import { Lifetime } from "awilix";
import EventWebhooks from "../models/event-webhooks";
import { createHash } from "crypto";
import { Repository } from "typeorm";

class EventWebhookService extends TransactionBaseService {
  static identifier = "eventWebhookService";
  static LIFE_TIME = Lifetime.SCOPED;
  protected TOKEN_SECRET = "default";
  protected readonly eventWebhookRepository_: Repository<EventWebhooks>;
  constructor(container, options) {
    super(arguments[0]);
    this.eventWebhookRepository_ =
      this.activeManager_.getRepository(EventWebhooks);
    this.TOKEN_SECRET = options.TOKEN_SECRET;
  }

  async create(data) {
    let newWebhook = await this.eventWebhookRepository_.save(
      this.eventWebhookRepository_.create({
        webhook_url: data.webhook_url,
        event_types: data.event_types,
        access_key: createHash("sha256")
          .update(`${data.webhook_url}${this.TOKEN_SECRET}`)
          .digest("hex"),
      })
    );

    return newWebhook;
  }

  async getAllWebhooks() {
    return await this.eventWebhookRepository_.find({});
  }

  async updateWebhookStatus(data: { id: string; active: boolean }) {
    await this.eventWebhookRepository_.update(
      { id: data.id },
      { active: data.active }
    );
    return;
  }

  async updateWebhookEvents(data: { id: string; event_types: string[] }) {
    await this.eventWebhookRepository_.update(
      { id: data.id },
      { event_types: data.event_types }
    );
    return;
  }
}

export default EventWebhookService;
