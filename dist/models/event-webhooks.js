"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const typeorm_1 = require("typeorm");
const medusa_1 = require("@medusajs/medusa");
const utils_1 = require("@medusajs/medusa/dist/utils");
let EventWebhooks = class EventWebhooks extends medusa_1.SoftDeletableEntity {
    beforeInsert() {
        this.id = (0, utils_1.generateEntityId)(this.id, "event_webhooks");
    }
};
__decorate([
    (0, typeorm_1.Column)({ type: "varchar", nullable: false }),
    __metadata("design:type", String)
], EventWebhooks.prototype, "webhook_url", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "json", nullable: false, default: [] }),
    __metadata("design:type", Array)
], EventWebhooks.prototype, "event_types", void 0);
__decorate([
    (0, typeorm_1.BeforeInsert)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EventWebhooks.prototype, "beforeInsert", null);
EventWebhooks = __decorate([
    (0, typeorm_1.Entity)({ name: "event_webhooks" })
], EventWebhooks);
exports.default = EventWebhooks;
