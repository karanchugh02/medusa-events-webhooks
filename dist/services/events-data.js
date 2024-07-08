"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const medusa_1 = require("@medusajs/medusa");
const awilix_1 = require("awilix");
const medusa_core_utils_1 = require("medusa-core-utils");
class EventsDataService extends medusa_1.TransactionBaseService {
    constructor({ cartService, fulfillmentService, fulfillmentProviderService, lineItemService, orderService, productVariantService, totalsService, returnService, paymentService, customerService, }) {
        super(arguments[0]);
        this.cartService_ = cartService;
        this.fulfillmentService_ = fulfillmentService;
        this.fulfillmentProviderService_ = fulfillmentProviderService;
        this.lineItemService_ = lineItemService;
        this.orderService_ = orderService;
        this.productVariantService_ = productVariantService;
        this.totalsService_ = totalsService;
        this.returnService_ = returnService;
        this.paymentService_ = paymentService;
        this.customerService_ = customerService;
    }
    humanPrice_(amount, currency) {
        if (!amount) {
            return "0.00";
        }
        const normalized = (0, medusa_core_utils_1.humanizeAmount)(amount, currency);
        return normalized.toFixed(medusa_core_utils_1.zeroDecimalCurrencies.includes(currency.toLowerCase()) ? 0 : 2);
    }
    normalizeThumbUrl_(url) {
        if (!url) {
            return null;
        }
        if (url.startsWith("http")) {
            return url;
        }
        else if (url.startsWith("//")) {
            return `https:${url}`;
        }
        return url;
    }
    async extractLocale(fromOrder) {
        if (fromOrder.cart_id) {
            try {
                const cart = await this.cartService_.retrieve(fromOrder.cart_id, {
                    select: ["id", "context"],
                });
                if (cart.context && cart.context.locale) {
                    return cart.context.locale;
                }
            }
            catch (err) {
                this.logger.error(err);
                this.logger.warn("Failed to gather context for order");
                return null;
            }
        }
        return null;
    }
    async getOrderData(event, data) {
        const verb = event.split(".")[1];
        if (verb === "refund_created") {
            const order = await this.orderService_.retrieveWithTotals(data.id, {
                select: ["total"],
                relations: ["refunds", "items"],
            });
            const refund = order.refunds.find((refund) => refund.id === data.refund_id);
            return {
                order,
                refund,
                refund_amount: `${this.humanPrice_(refund.amount, order.currency_code)} ${order.currency_code}`,
                email: order.email,
            };
        }
        else {
            const order = await this.orderService_.retrieve(data.id, {
                select: [
                    "shipping_total",
                    "discount_total",
                    "tax_total",
                    "refunded_total",
                    "gift_card_total",
                    "subtotal",
                    "total",
                ],
                relations: [
                    "customer",
                    "billing_address",
                    "shipping_address",
                    "discounts",
                    "discounts.rule",
                    "shipping_methods",
                    "shipping_methods.shipping_option",
                    "payments",
                    "fulfillments",
                    "returns",
                    "gift_cards",
                    "gift_card_transactions",
                ],
            });
            const currencyCode = order.currency_code.toUpperCase();
            const locale = await this.extractLocale(order);
            if (verb === "return_requested" ||
                verb === "items_returned" ||
                verb === "return_action_required") {
                const returnRequest = await this.returnService_.retrieve(data.return_id, {
                    relations: [
                        "items",
                        "items.item",
                        "items.item.tax_lines",
                        "items.item.variant",
                        "items.item.variant.product",
                        "shipping_method",
                        "shipping_method.tax_lines",
                        "shipping_method.shipping_option",
                    ],
                });
                const allItems = await this.lineItemService_.list({ id: returnRequest.items.map(({ item_id }) => item_id) }, { relations: ["tax_lines"] });
                // Calculate which items are in the return
                let items = await Promise.all(returnRequest.items.map(async (i) => {
                    const found = allItems.find((oi) => oi.id === i.item_id);
                    found.quantity = i.quantity;
                    found.thumbnail = this.normalizeThumbUrl_(found.thumbnail);
                    found.totals = await this.totalsService_.getLineItemTotals(found, order, {
                        include_tax: true,
                        use_tax_lines: true,
                    });
                    found.price = `${this.humanPrice_(found.totals.total, currencyCode)} ${currencyCode}`;
                    found.tax_lines = found.totals.tax_lines;
                    return found;
                }));
                const item_subtotal = items.reduce((acc, next) => acc + next.totals.total, 0);
                let shippingTotal = 0;
                if (returnRequest.shipping_method) {
                    const base = returnRequest.shipping_method.price;
                    shippingTotal =
                        base +
                            returnRequest.shipping_method.tax_lines.reduce((acc, next) => {
                                return Math.round(acc + base * (next.rate / 100));
                            }, 0);
                }
                return {
                    locale,
                    has_shipping: !!returnRequest.shipping_method,
                    email: order.email,
                    items,
                    subtotal: `${this.humanPrice_(item_subtotal, currencyCode)} ${currencyCode}`,
                    shipping_total: `${this.humanPrice_(shippingTotal, currencyCode)} ${currencyCode}`,
                    refund_amount: `${this.humanPrice_(returnRequest.refund_amount, currencyCode)} ${currencyCode}`,
                    return_request: {
                        ...returnRequest,
                        refund_amount: `${this.humanPrice_(returnRequest.refund_amount, currencyCode)} ${currencyCode}`,
                    },
                    order,
                    date: returnRequest.updated_at.toDateString(),
                };
            }
            else {
                const taxRate = order.tax_rate / 100;
                let items = await Promise.all(order.items.map(async (i) => {
                    i.totals = await this.totalsService_.getLineItemTotals(i, order, {
                        include_tax: true,
                        use_tax_lines: true,
                    });
                    i.thumbnail = this.normalizeThumbUrl_(i.thumbnail);
                    i.discounted_price = `${this.humanPrice_(i.totals.total / i.quantity, currencyCode)} ${currencyCode}`;
                    i.price = `${this.humanPrice_(i.totals.original_total / i.quantity, currencyCode)} ${currencyCode}`;
                    return i;
                }));
                let discounts = [];
                if (order.discounts) {
                    discounts = order.discounts.map((discount) => {
                        return {
                            is_giftcard: false,
                            code: discount.code,
                            descriptor: `${discount.rule.value}${discount.rule.type === "percentage" ? "%" : ` ${currencyCode}`}`,
                        };
                    });
                }
                let giftCards = [];
                if (order.gift_cards) {
                    giftCards = order.gift_cards.map((gc) => {
                        return {
                            is_giftcard: true,
                            code: gc.code,
                            descriptor: `${gc.value} ${currencyCode}`,
                        };
                    });
                    discounts.concat(giftCards);
                }
                return {
                    ...order,
                    locale,
                    has_discounts: order.discounts.length,
                    has_gift_cards: order.gift_cards.length,
                    date: order.created_at.toDateString(),
                    items,
                    discounts,
                    subtotal: `${this.humanPrice_(order.subtotal * (1 + taxRate), currencyCode)} ${currencyCode}`,
                    gift_card_total: `${this.humanPrice_(order.gift_card_total * (1 + taxRate), currencyCode)} ${currencyCode}`,
                    tax_total: `${this.humanPrice_(order.tax_total, currencyCode)} ${currencyCode}`,
                    discount_total: `${this.humanPrice_(order.discount_total * (1 + taxRate), currencyCode)} ${currencyCode}`,
                    shipping_total: `${this.humanPrice_(order.shipping_total * (1 + taxRate), currencyCode)} ${currencyCode}`,
                    total: `${this.humanPrice_(order.total, currencyCode)} ${currencyCode}`,
                };
            }
        }
    }
    async getCartData(event, data) {
        let cartData = await this.cartService_.retrieveWithTotals(data.id);
        return cartData;
    }
    async getPaymentData(event, data) {
        let paymentData = await this.paymentService_.retrieve(data.id);
        return paymentData;
    }
    async getCustomerData(event, data) {
        let customerData = await this.customerService_.retrieve(data.id, {
            relations: ["billing_address", "shipping_addresses"],
        });
        console.log("customer data");
        console.dir(customerData, { depth: null });
        return customerData;
    }
    async fetchData(event, data) {
        switch (event.split(".")[0]) {
            case "order":
                return await this.getOrderData(event, data);
            case "cart":
                return await this.getCartData(event, data);
            case "payment":
                return await this.getPaymentData(event, data);
            case "customer":
                return await this.getCustomerData(event, data);
            default:
                return {};
        }
    }
}
EventsDataService.identifier = "eventsDataService";
EventsDataService.LIFE_TIME = awilix_1.Lifetime.SCOPED;
exports.default = EventsDataService;
