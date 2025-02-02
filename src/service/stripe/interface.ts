export interface IInitializePayment {
  name: string
  email: string
  customer_id: string | null
  amount: number
  description: string
}

export interface IInitializePaymentResult {
  id: string,
  ephemeral_key: string,
  customer_id: string,
  publishable_key: string,
  payment_secret: string,
}
export interface IStripeCustomer {
  id: string
  object: string
  address: any
  balance: number
  created: number
  currency: any
  default_source: any
  delinquent: boolean
  description: any
  discount: any
  email: string
  invoice_prefix: string
  invoice_settings: {
    custom_fields: any
    default_payment_method: any
    footer: any
    rendering_options: any
  }
  livemode: boolean
  metadata: Record<string, any>
  name: string
  next_invoice_sequence: number
  phone: any
  preferred_locales: any[]
  shipping: any
  tax_exempt: string
  test_clock: any
}


export interface IStripePaymentIntent {
  id: string
  object: string
  amount: number
  amount_capturable: number
  amount_details: {
    tip: any
  }
  amount_received: number
  application: any
  application_fee_amount: any
  automatic_payment_methods: {
    enabled: boolean
  }
  canceled_at: any
  cancellation_reason: any
  capture_method: string
  client_secret: string
  confirmation_method: string
  created: number
  currency: string
  customer: any
  description: any
  invoice: any
  last_payment_error: any
  latest_charge: any
  livemode: boolean
  metadata: Record<string, any>
  next_action: any
  on_behalf_of: any
  payment_method: any
  payment_method_options: {
    card: {
      installments: any
      mandate_options: any
      network: any
      request_three_d_secure: string
    }
    link: {
      persistent_token: any
    }
  }
  payment_method_types: string[]
  processing: any
  receipt_email: any
  review: any
  setup_future_usage: any
  shipping: any
  source: any
  statement_descriptor: any
  statement_descriptor_suffix: any
  status: string
  transfer_data: any
  transfer_group: any
}
