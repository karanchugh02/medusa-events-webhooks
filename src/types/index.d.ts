interface Address {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  customer_id: string | null;
  company: string;
  first_name: string;
  last_name: string;
  address_1: string;
  address_2: string;
  city: string;
  country_code: string;
  province: string;
  postal_code: string;
  phone: string;
  metadata: any | null;
}

interface LineItemTaxLine {
  id: string;
  created_at: string;
  updated_at: string;
  rate: number;
  name: string;
  code: string;
  metadata: any | null;
  item_id: string;
}

interface ShippingProfile {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  name: string;
  type: string;
  metadata: any | null;
}

interface Product {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  title: string;
  subtitle: string | null;
  description: string;
  handle: string;
  is_giftcard: boolean;
  status: string;
  thumbnail: string;
  weight: number;
  length: number | null;
  height: number | null;
  width: number | null;
  hs_code: string | null;
  origin_country: string | null;
  mid_code: string | null;
  material: string | null;
  collection_id: string | null;
  type_id: string | null;
  discountable: boolean;
  external_id: string | null;
  metadata: any | null;
  profiles: ShippingProfile[];
  profile: ShippingProfile;
  profile_id: string;
}

interface ProductVariant {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  title: string;
  product_id: string;
  sku: string | null;
  barcode: string | null;
  ean: string | null;
  upc: string | null;
  variant_rank: number;
  inventory_quantity: number;
  allow_backorder: boolean;
  manage_inventory: boolean;
  hs_code: string | null;
  origin_country: string | null;
  mid_code: string | null;
  material: string | null;
  weight: number | null;
  length: number | null;
  height: number | null;
  width: number | null;
  metadata: any | null;
  product: Product;
}

interface LineItem {
  id: string;
  created_at: string;
  updated_at: string;
  cart_id: string;
  order_id: string;
  swap_id: string | null;
  claim_order_id: string | null;
  original_item_id: string | null;
  order_edit_id: string | null;
  title: string;
  description: string;
  thumbnail: string;
  is_return: boolean;
  is_giftcard: boolean;
  should_merge: boolean;
  allow_discounts: boolean;
  has_shipping: boolean;
  unit_price: number;
  variant_id: string;
  quantity: number;
  fulfilled_quantity: number | null;
  returned_quantity: number | null;
  shipped_quantity: number | null;
  metadata: any;
  adjustments: any[];
  tax_lines: LineItemTaxLine[];
  variant: ProductVariant;
  subtotal: number;
  discount_total: number;
  total: number;
  original_total: number;
  original_tax_total: number;
  tax_total: number;
  raw_discount_total: number;
  totals: {
    unit_price: number;
    quantity: number;
    subtotal: number;
    discount_total: number;
    total: number;
    original_total: number;
    original_tax_total: number;
    tax_total: number;
    tax_lines: LineItemTaxLine[];
    raw_discount_total: number;
  };
  discounted_price: string;
  price: string;
}

interface Region {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  name: string;
  currency_code: string;
  tax_rate: number;
  tax_code: string | null;
  gift_cards_taxable: boolean;
  automatic_taxes: boolean;
  tax_provider_id: string | null;
  metadata: any;
}

interface ShippingMethodTaxLine {
  id: string;
  created_at: string;
  updated_at: string;
  rate: number;
  name: string;
  code: string;
  metadata: any | null;
  shipping_method_id: string;
}

interface ShippingOption {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  name: string;
  region_id: string;
  profile_id: string;
  provider_id: string;
  price_type: string;
  amount: number;
  is_return: boolean;
  admin_only: boolean;
  data: { id: string };
  metadata: any | null;
}

interface ShippingMethod {
  id: string;
  shipping_option_id: string;
  order_id: string;
  claim_order_id: string | null;
  cart_id: string;
  swap_id: string | null;
  return_id: string | null;
  price: number;
  data: any;
  shipping_option: ShippingOption;
  tax_lines: ShippingMethodTaxLine[];
}

interface Order {
  object: string;
  id: string;
  created_at: string;
  updated_at: string;
  status: string;
  fulfillment_status: string;
  payment_status: string;
  display_id: number;
  cart_id: string;
  customer_id: string;
  email: string;
  billing_address_id: string;
  shipping_address_id: string;
  region_id: string;
  currency_code: string;
  tax_rate: number | null;
  draft_order_id: string | null;
  canceled_at: string | null;
  metadata: any;
  no_notification: boolean | null;
  idempotency_key: string | null;
  external_id: string | null;
  sales_channel_id: string;
  billing_address: Address;
  claims: any[];
  customer: Customer;
  discounts: any[];
  fulfillments: any[];
  gift_card_transactions: any[];
  gift_cards: any[];
  items: LineItem[];
  payments: Payment[];
  refunds: any[];
  region: Region;
  returns: any[];
  shipping_address: Address;
  shipping_methods: ShippingMethod[];
  swaps: any[];
  shipping_total: string;
  discount_total: string;
  tax_total: string;
  refunded_total: number;
  gift_card_total: string;
  gift_card_tax_total: number;
  subtotal: string;
  total: string;
  locale: string | null;
  has_discounts: number;
  has_gift_cards: number;
  date: string;
}

type Cart = {
  object: "cart";
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  email: string;
  billing_address_id: string;
  shipping_address_id: string;
  region_id: string;
  customer_id: string;
  payment_id: string;
  type: string;
  completed_at: string;
  payment_authorized_at: string;
  idempotency_key: string | null;
  context: {
    ip: string;
    user_agent: string;
  };
  metadata: any | null;
  sales_channel_id: string;
  discounts: any[];
  gift_cards: any[];
  items: LineItem[];
  region: Region;
  shipping_address: Address;
  shipping_methods: ShippingMethod[];
  subtotal: number;
  discount_total: number;
  item_tax_total: number;
  shipping_total: number;
  shipping_tax_total: number;
  tax_total: number;
  raw_discount_total: number;
  gift_card_total: number;
  gift_card_tax_total: number;
  total: number;
};

interface Payment {
  id: string;
  created_at: string;
  updated_at: string;
  swap_id: string | null;
  cart_id: string;
  order_id: string;
  amount: number;
  currency_code: string;
  amount_refunded: number;
  provider_id: string;
  data: { status: string };
  captured_at: string | null;
  canceled_at: string | null;
  metadata: any | null;
  idempotency_key: string | null;
}

interface Customer {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  email: string;
  first_name: string | null;
  last_name: string | null;
  billing_address_id: string | null;
  billing_address: Address | null;
  shipping_addresses: Address[];
  phone: string | null;
  has_account: boolean;
  metadata: any | null;
}
