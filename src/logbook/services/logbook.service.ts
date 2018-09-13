import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Log } from '../interfaces/log.interface';

import { UserService } from '../../user/services/user.service';
import { AirportService } from '../../airports/services/airport.service';

import { LogDto } from '../dtos/log.dto';

import { FlightRoleEnum } from '../enums/flightrole.enum';
import { AircraftTypeEnum } from '../enums/aircraft-type.enum';
import { DayTimeEnum } from '../enums/daytime.enum';

import * as moment from 'moment';
import { Model } from 'mongoose';

/**
* {
    "date": "2018-09-06",
    "aircraft": {
      "registration": "D-EPPO",
      "model": "DA-20",
      "type": "single engine"
    },
    "pic": {
      "duty": "PIC"
    },
    "pm": {
      "name": "",
      "duty": ""
    },
    "from": "EDAY",
    "to": "EDAY",
    "time": {
      "start": "09:12",
      "end": "10:16",
      "nextDay": false,
      "total": null,
      "dayTime": "day"
    },
    "remarks": "This is a remark"
  }
 */

@Injectable()
export class LogbookService {
  constructor(
    @InjectModel('Log') private readonly logModel: Model<Log>,
    private readonly userService: UserService,
    private readonly airportService: AirportService
  ) {}

  _verifyEnum(enumToCheck: any, roleToCheck: string): boolean {
    if (!(<any>Object).values(enumToCheck).includes(roleToCheck)) {
      return false;
    }
    return true;
  }

  // Get all logged flights
  async getLogs(params: any): Promise<Log[] | {}> {
    const user = await this.userService.findOneByEmail(params.email);
    const filterQuery = params.query;
    let query: {} = {};

    
    if (!user) {
      throw new NotFoundException({
        success: false,
        message: 'No user with this email.'
      })
    }

    query["pic.id"] = user.id;
    
    if (filterQuery.fromDate && filterQuery.toDate) {
      query["date"] = { "$gte": new Date(filterQuery.fromDate), "$lte": new Date(filterQuery.toDate) };
    }
    
    if (filterQuery.fromDate && !filterQuery.toDate) {
      query["date"] = { "$gte": new Date(filterQuery.fromDate) };
    }
    
    if (!filterQuery.fromDate && filterQuery.toDate) {
      query["date"] = { "$lte": new Date(filterQuery.toDate) };
    }

    if (filterQuery.from) {
      query["from.name"] = filterQuery.from;
    }

    if (filterQuery.to) {
      query["to.name"] = filterQuery.to;
    }

    if (filterQuery.aircraftRegistration) {
      query["aircraft.registration"] = filterQuery.aircraftRegistration;
    }

    if (filterQuery.aircraftModel) {
      query["aircraft.model"] = filterQuery.aircraftModel;
    }

    if (filterQuery.aircraftType) {
      query["aircraft.type"] = filterQuery.aircraftType;
    }

    if (filterQuery.dayTime) {
      query["time.dayTime"] = filterQuery.daytime;
    }
    
    return await this.logModel.find(query);
  }

  async getLog(params: any): Promise<Log | {}> {
    const user = await this.userService.findOneByEmail(params.email);
    const log = await this.logModel.findOne({ _id: params.logId });

    if (!log || !user) {
      throw new NotFoundException({
        success: false,
        message: "No log or user found!"
      });
    }

    if (user.id != log.pic.id) {
      throw new UnauthorizedException({
        success: false,
        message: "You are not authorized to view this log."
      })
    }

    return log;
  }

  // Logs a flight in the logbook
  async createLog(params: LogDto): Promise<Log | {}> {
    const user = await this.userService.findOneByEmail(params.pic.email);
    const from = await this.airportService.findOne(params.from);
    const to = await this.airportService.findOne(params.to);
    const timeRegex = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

    // Date format MUST be YYYY-MM-DD
    const date = new Date(params.date).toUTCString();
    const createdOn = moment.utc(Date.now());

    // Verifies if input is an enum
    if (!this._verifyEnum(AircraftTypeEnum, params.aircraft.type) || !this._verifyEnum(FlightRoleEnum, params.pic.duty) || !this._verifyEnum(DayTimeEnum, params.time.dayTime)) {
      throw new BadRequestException({
        success: false,
        message: 'Aicraft type, flight role or daytime has a bad format!'
      });
    }

    if (!timeRegex.test(params.time.start) || !timeRegex.test(params.time.end)) {
      throw new BadRequestException({
        success: false,
        message: 'Start or end - block time has a bad format.'
      });
    }

    // Calculates the total flight time
    if (!params.time.nextDay) {
      const seconds = moment(params.time.end, 'HH:mm').diff(moment(params.time.start, 'HH:mm'), 'seconds');
      if (seconds < 1) {
        throw new BadRequestException({
          success: false,
          message: 'The start time can\'t be after the end time'
        });
      }
      const total = moment("2015-01-01").startOf('day')
        .seconds(seconds)
        .format('HH:mm');

      params.time.total = total;
    } else {
      const secondsToEndOfDay = moment(moment().endOf('day'), 'HH:mm').diff(moment(params.time.start, 'HH:mm'), 'seconds');
      const secondsOfTheNewDay = moment(params.time.end, 'HH:mm').diff(moment().startOf('day'), 'seconds');
      
      const total = moment("2015-01-01").startOf('day')
      .seconds((secondsToEndOfDay + secondsOfTheNewDay) + 1)
      .format('HH:mm');

      params.time.total = total;
    }

    let model = new this.logModel({
      date,
      aircraft: params.aircraft,
      pic: {
        id: user.id,
        name: user.name,
        duty: params.pic.duty
      },
      pm: params.pm,
      from: {
        id: from.id,
        name: from.icao
      },
      to: {
        id: to.id,
        name: to.icao
      },
      time: params.time,
      remarks: params.remarks,
      createdOn
    });

    try {
      return await this.logModel.create(model);
    } catch (e) {
      return {
        error: e
      }
    }
  }
}
