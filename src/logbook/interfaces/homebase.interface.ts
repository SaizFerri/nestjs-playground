import { AircraftTypeEnum } from "../enums/aircraft-type.enum";

export interface HomeBase {
  userId?: string | Number,
  aircraft: {
    registration: string,
    model: string,
    type: AircraftTypeEnum
  },
  from: {
    id?: string,
    name: string
  },
  createdOn?: Date,
  updatedOn?: Date
}