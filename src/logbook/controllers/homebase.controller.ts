import { Controller, Get, Post, Body, UseGuards, Put, Param, Header, Req, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Roles } from '../../auth/decorators/roles.decorator';
import { AuthService } from '../../auth/services/auth.service';
import { HomeBase } from '../interfaces/homebase.interface';
import { HomeBaseService } from '../services/homebase.service';

import * as mongoose from 'mongoose';

@Controller('homebase')
export class HomeBaseController {
  constructor(
    private readonly homeBaseService: HomeBaseService,
    private readonly authService: AuthService
  ) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getHomeBases(@Req() request): Promise<HomeBase[] | any> {
    const token = request.headers.authorization.split(' ')[1];
    const { id } = this.authService.decodeToken(token);

    return await this.homeBaseService.getHomeBases(id);
  }


  // Maybe new URL?
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getHomeBase(@Req() request, @Param('id') homeBaseId: Number): Promise<HomeBase[] | any> {
    const token = request.headers.authorization.split(' ')[1];
    const { id } = this.authService.decodeToken(token);

    // Redo this
    if (!mongoose.Types.ObjectId.isValid(homeBaseId)) {
      throw new BadRequestException({
        success: false,
        error: "The id is wrong."
      })
    }

    return await this.homeBaseService.getHomeBase(id, homeBaseId);
  }

  // Create a new logbook
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createHomeBase(@Req() request, @Body() params: HomeBase): Promise<HomeBase | any> {
    const token = request.headers.authorization.split(' ')[1];
    const { id } = this.authService.decodeToken(token);
    
    params.userId = id;
    
    return await this.homeBaseService.createHomeBase(params);
  }
}
