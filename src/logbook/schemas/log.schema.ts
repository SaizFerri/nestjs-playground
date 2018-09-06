import * as mongoose from 'mongoose';
import { AircraftTypeEnum } from '../enums/aircraft-type.enum';
import { FlightRoleEnum } from '../enums/flightrole.enum';
import { DayTimeEnum } from '../enums/daytime.enum';

export const LogSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  aircraft: {
    registration: { type: String, required: true },
    model: { type: String, required: true },
    type: { type: AircraftTypeEnum, required: true },
  },
  pic: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, ref: 'User', required: true },
    duty: { type: FlightRoleEnum, required: true, default: null }
  },
  pm: {
    name: { type: String, default: null },
    duty: { type: FlightRoleEnum, default: null }
  },
  from: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'AirportSchema', required: true },
    name: { type: String }
  },
  to: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'AirportSchema', required: true },
    name: { type: String }
  },
  time: {
    start: { type: String, required: true },
    end: { type: String, required: true },
    nextDay: { type: Boolean, required: true, default: false },
    total: { type: String },
    dayTime: { type: DayTimeEnum, required: true }
  },
  remarks: { type: String, default: null },
  createdOn: { type: Date, default: null },
  updatedOn: { type: Date, default: null }
})