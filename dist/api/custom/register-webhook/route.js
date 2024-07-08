"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
const event_webhooks_1 = __importDefault(require("../../../models/event-webhooks"));
const POST = async (req, res) => {
    const logger = req.scope.resolve("logger");
    try {
        logger.debug(`webhook url and events : ${JSON.stringify(req.body)}`);
        let data = req.body;
        const manager = req.scope.resolve("manager");
        const eventWebhookRepo_ = manager.getRepository(event_webhooks_1.default);
        let newWebhook = await eventWebhookRepo_.save({
            webhook_url: data.webhook_url,
            event_types: data.event_types,
        });
        return res.status(200).json({ status: true, data: newWebhook });
    }
    catch (err) {
        logger.error("Error authorizing google:", err);
        return res.status(500).json({ status: false, message: err.message });
    }
};
exports.POST = POST;
