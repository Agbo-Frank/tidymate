export interface IPagination {
  page: number 
  limit: number
  paginate?: boolean
}

export interface IChargePayload {
  user: string
  amount: number
  card?: string
  description?: string
  metadata?: any
  resources: "order" | "wallet"
}