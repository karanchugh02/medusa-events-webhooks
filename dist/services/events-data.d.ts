import { CartService, Logger, TransactionBaseService } from "@medusajs/medusa";
import { CustomerService, FulfillmentProviderService, FulfillmentService, LineItemService, OrderService, PaymentService, ProductVariantService, ReturnService, TotalsService } from "@medusajs/medusa/dist/services";
declare class EventsDataService extends TransactionBaseService {
    static identifier: string;
    static LIFE_TIME: import("awilix").LifetimeType;
    protected readonly cartService_: CartService;
    protected readonly fulfillmentService_: FulfillmentService;
    protected readonly fulfillmentProviderService_: FulfillmentProviderService;
    protected readonly lineItemService_: LineItemService;
    protected readonly orderService_: OrderService;
    protected readonly productVariantService_: ProductVariantService;
    protected readonly totalsService_: TotalsService;
    protected readonly logger: Logger;
    protected readonly returnService_: ReturnService;
    protected readonly paymentService_: PaymentService;
    protected readonly customerService_: CustomerService;
    constructor({ cartService, fulfillmentService, fulfillmentProviderService, lineItemService, orderService, productVariantService, totalsService, returnService, paymentService, customerService, }: {
        cartService: any;
        fulfillmentService: any;
        fulfillmentProviderService: any;
        lineItemService: any;
        orderService: any;
        productVariantService: any;
        totalsService: any;
        returnService: any;
        paymentService: any;
        customerService: any;
    });
    private humanPrice_;
    private normalizeThumbUrl_;
    private extractLocale;
    private getOrderData;
    private getCartData;
    private getPaymentData;
    private getCustomerData;
    fetchData(event: string, data: any): Promise<{}>;
}
export default EventsDataService;
