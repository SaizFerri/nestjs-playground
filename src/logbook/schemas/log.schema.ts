import * as mongoose from 'mongoose';

export const LogSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  aircraftRegistration: { type: String, required: true },
  aircraftType: { type: String, required: true },
  pic: {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    duty: { type: String }
  },
  pm: {
    name: { type: String },
    duty: { type: String }
  },
  from: { type: mongoose.Schema.Types.ObjectId, ref: 'AirportSchema', required: true },
  to: { type: mongoose.Schema.Types.ObjectId, ref: 'AirportSchema', required: true },
  startBlock: { type: String, required: true },
  endBlock: { type: String, required: true },
  totalTime: { type: String },
  aircraft: { type: String, required: true },
  dayTime: { type: String, required: true },
  remarks: { type: String }
})