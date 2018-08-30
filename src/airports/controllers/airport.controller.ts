import { Controller, Get, Param } from "@nestjs/common";

import { AirportService } from "../services/airport.service";
import { Airport } from "../interfaces/airport.interface";

@Controller()
export class AirportController {
  constructor(private readonly airportService: AirportService){}

  @Get('airports/:param')
  async getAirports(@Param('param') param): Promise<Airport | any> {
    return await this.airportService.filterAirports(param);
  }
}
