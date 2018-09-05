import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Log } from '../interfaces/log.interface';

import { UserService } from '../../user/services/user.service';
import { AirportService } from '../../airports/services/airport.service';

import { LogDto } from '../dtos/log.dto';

import { Model } from 'mongoose';

@Injectable()
export class LogbookService {
  constructor(
    @InjectModel('Log') private readonly logModel: Model<Log>,
    private readonly userService: UserService,
    private readonly airportService: AirportService
  ) {}

  // Finish this!
  async createLog(params: LogDto): Promise<Log> {
    let user = await this.userService.findOneByEmail(params.user);
    let from = await this.airportService.filterAirports(params.from);
    let to = await this.airportService.filterAirports(params.to);

    let model = new this.logModel({
      
    })
    return ;
  }
}
