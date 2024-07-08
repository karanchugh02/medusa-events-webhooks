"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventWebhooksRepository = void 0;
const database_1 = require("@medusajs/medusa/dist/loaders/database");
const event_webhooks_1 = __importDefault(require("../models/event-webhooks"));
console.log("data source ", database_1.dataSource);
exports.EventWebhooksRepository = database_1.dataSource.getRepository(event_webhooks_1.default);
exports.default = exports.EventWebhooksRepository;
