import { Injectable, BadRequestException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { HomeBase } from '../interfaces/homebase.interface';

import { UserService } from '../../user/services/user.service';
import { AirportService } from '../../airports/services/airport.service';

import { AircraftTypeEnum } from '../enums/aircraft-type.enum';

import * as moment from 'moment';
import { Model } from 'mongoose';

@Injectable()
export class HomeBaseService {
  constructor(
    @InjectModel('HomeBase') private readonly homeBaseModel: Model<HomeBase>,
    private readonly userService: UserService,
    private readonly airportService: AirportService
  ) {}

  async getHomeBases(id: Number): Promise<HomeBase[] | {}> {
    return await this.homeBaseModel.find({ userId: id });
  }

  async getHomeBase(id: Number, homeBaseId: Number): Promise<HomeBase | {}> {
    try {
      return await this.homeBaseModel.findOne({ _id: homeBaseId, userId: id });
    } catch (e) {
      return {
        error: e
      }
    }
  }

  async createHomeBase(params: HomeBase): Promise<HomeBase | {}> {
    const createdOn = moment.utc(Date.now());
    const from = await this.airportService.findOne(params.from.name);

    if (from.error) {
      throw new BadRequestException({
        success: false,
        error: `${params.from.name} isn't a known airport.`
      })
    }

    let model = new this.homeBaseModel({
      userId: params.userId,
      aircraft: params.aircraft,
      from: {
        id: from.id,
        name: from.name
      },
      createdOn
    });

    try {
      return await this.homeBaseModel.create(model);
    } catch (e) {
      return {
        error: e
      }
    }
  }
}
