import * as mongoose from 'mongoose';

export const AirportSchema = new mongoose.Schema({
  icao: { type: String },
  iata: { type: String },
  name: { type: String },
  city: { type: String },
  state: { type: String },
  country: { type: String },
  elevation: { type: Number },
  lat: { type: Number },
  lon: { type: Number },
  timezone: { type: String }
})