import * as mongoose from 'mongoose';
import { AircraftTypeEnum } from '../enums/aircraft-type.enum';

export const HomeBaseSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  aircraft: {
    registration: { type: String, required: true },
    model: { type: String, required: true },
    type: { type: AircraftTypeEnum, required: true },
  },
  from: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'AirportSchema', required: true },
    name: { type: String }
  },
  createdOn: { type: Date, default: null },
  updatedOn: { type: Date, default: null }
})