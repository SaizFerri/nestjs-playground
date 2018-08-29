import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Model } from 'mongoose';

import { Airport } from "../interfaces/airport.interface";

@Injectable()
export class AirportService {
  constructor(
    @InjectModel('Airport') private readonly airportModel: Model<Airport>,
  ) {}

  async filterAirports(code: string): Promise<Airport> {
    return await this.airportModel.findOne({ icao: code });
  }
}