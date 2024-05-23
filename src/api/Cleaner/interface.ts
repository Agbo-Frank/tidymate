export interface ISetLocation {
  long: number
  lat: number
}

export interface IUploaDocs {
  type: "proof_of_work" | "profile" | "gov_id" | "back_check",
  image: string
}

export interface ICreateRequest {
  phone_number: string
  house_num?: string
  city: string
  state: string
  postal_code: string
}