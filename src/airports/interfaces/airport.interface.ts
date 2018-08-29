export interface Airport {
  id?: number,
  icao: string,
  iata: string,
  name: string,
  city: string,
  state: string,
  country: string,
  elevation: number,
  lat: number,
  lon: number,
  timezone: string,
}