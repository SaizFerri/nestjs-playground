import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { Model } from 'mongoose';

import { Airport } from "../interfaces/airport.interface";

@Injectable()
export class AirportService {
  constructor(
    @InjectModel('Airport') private readonly airportModel: Model<Airport>,
  ) {}

  async findOne(code: string): Promise<Airport | any> {
    if (code.length > 4 ) {
      return {
        error: true,
        message: "Icao code must be between 1 and 4 characters"
      };
    }
    return await this.airportModel.findOne({ icao: code });
  }

  async filterAirports(code: string): Promise<Airport | any> {
    if (code.length > 4 ) {
      return {
        error: true,
        message: "Icao code must be between 1 and 4 characters"
      };
    }
    return await this.airportModel.find({ icao: { $regex: new RegExp(`^${code}`), $options: 'i'  }}).limit(10);
  }
}