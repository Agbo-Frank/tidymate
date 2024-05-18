export interface ICreateOrder {
  service: string
  note: string
  start_date: number
  config: Record<string, number>
  location: {
    address: string,
    coordinates: number[]
  }
}

export interface IProcessPayment {
  order_id: string
  method: "wallet" | "card" | "paypal"
  card: string
}

export interface IAddCleaner {
  order: string,
  cleaners: string[]
}

export interface IReOrder {
  order: string,
  start_date: number
}