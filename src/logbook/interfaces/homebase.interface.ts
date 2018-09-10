import { AircraftTypeEnum } from "../enums/aircraft-type.enum";

export interface HomeBase {
  userId?: Number,
  aircraft: {
    registration: string,
    model: string,
    type: AircraftTypeEnum
  },
  from: {
    id?: Number,
    name: string
  },
  createdOn?: Date,
  updatedOn?: Date
}