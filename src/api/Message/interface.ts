
export interface IResponse {
  message: string
  data: any
  status: "failed" | "success"
}

export type Callback = (res: IResponse) => any

export interface ICreateMessage { 
  order: string
  message: string
}