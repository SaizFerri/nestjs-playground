import { Controller, Get, Post, Body, UseGuards, Put, Param, Header, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Roles } from '../../auth/decorators/roles.decorator';
import { LogDto } from '../dtos/log.dto';
import { Log } from '../interfaces/log.interface';
import { LogbookService } from '../services/logbook.service';
import { AuthService } from 'auth/services/auth.service';

@Controller('logbook')
export class LogbookController {
  constructor(
    private readonly logbookService: LogbookService,
    private readonly authService: AuthService
  ) {}

  // Get all the logbook from a user
  @Get()
  @UseGuards(AuthGuard('jwt'))
  async getLogs(@Req() request): Promise<Log[] | any> {
    const token = request.headers.authorization.split(' ')[1];
    const { email } = this.authService.decodeToken(token);

    return await this.logbookService.getLogs({ email });
  }

  // Get log by id
  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async getLog(@Req() request, @Param('id') id): Promise<Log[] | any> {
    const token = request.headers.authorization.split(' ')[1];
    const { email } = this.authService.decodeToken(token);

    return await this.logbookService.getLog({ email, logId: id});
  }

  // Create a new logbook
  @Post()
  @UseGuards(AuthGuard('jwt'))
  async createLog(@Req() request, @Body() params: LogDto): Promise<Log | any> {
    const token = request.headers.authorization.split(' ')[1];
    const { email } = this.authService.decodeToken(token);
    
    params.pic.email = email;
    
    return await this.logbookService.createLog(params);
  }
}
