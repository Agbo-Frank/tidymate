export interface ISetLocation {
  long: number
  lat: number
}

export interface IUploaDocs {
  type: "proof_of_work" | "profile" | "gov_id" | "back_check",
  image: string
}