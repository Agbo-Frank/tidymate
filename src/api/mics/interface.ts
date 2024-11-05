
interface Location {
  latitude: number
  longitude: number
}
export interface IDirection {
  origin: Location
  destination: Location
  mode: "driving" | "walking" | "bicycling" | "transit"
}