import { Controller, Get, Post, Body, UseGuards, Put, Param, Header, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Roles } from '../../auth/decorators/roles.decorator';
import { AuthService } from 'auth/services/auth.service';
import { HomeBase } from '../interfaces/homebase.interface';
import { HomeBaseService } from '../services/homebase.service';

@Controller('homebase')
export class HomeBaseController {
  constructor(
    private readonly homeBaseService: HomeBaseService,
    private readonly authService: AuthService
  ) {}

  // Create a new logbook
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createLog(@Req() request, @Body() params: HomeBase): Promise<HomeBase | any> {
    const token = request.headers.authorization.split(' ')[1];
    const { id } = this.authService.decodeToken(token);
    
    params.userId = id;
    
    return await this.homeBaseService.createHomeBase(params);
  }
}
