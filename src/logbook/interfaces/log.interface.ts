export interface Log {
  date: Date,
  aircraftRegistration: string,
  aircraftType: string,
  pic: {
    id: string,
    name: string,
    duty?: string
  },
  pm?: {
    name?: string,
    duty?: string
  },
  from: string,
  to: string,
  startBlock: string,
  endBlock: string,
  totalTime: string,
  aircraft: string,
  dayTime: string,
  remarks?: string
}