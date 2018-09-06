import { DayTimeEnum } from "../enums/daytime.enum";
import { FlightRoleEnum } from "../enums/flightrole.enum";
import { AircraftTypeEnum } from "../enums/aircraft-type.enum";

export interface Log {
  date: Date,
  aircraft: {
    registration: string,
    model: string,
    type: AircraftTypeEnum
  },
  pic: {
    id: string,
    name: string,
    duty: FlightRoleEnum
  },
  pm?: {
    name?: string,
    duty?: FlightRoleEnum
  },
  from: {
    id: string,
    name: string
  },
  to: {
    id: string,
    name: string
  },
  time: {
    start: string,
    end: string,
    nextDay: boolean,
    total?: string,
    dayTime: DayTimeEnum
  },
  remarks?: string
}