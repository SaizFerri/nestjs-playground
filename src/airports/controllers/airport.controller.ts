import { Controller, Get, Param } from "@nestjs/common";

import { AirportService } from "../services/airport.service";
import { Airport } from "../interfaces/airport.interface";

@Controller()
export class AirportController {
  constructor(private readonly airportService: AirportService){}

  @Get('airports/:id')
  async getAirports(@Param('id') id): Promise<Airport> {
    return await this.airportService.filterAirports(id);
  }
}
