import { Controller, Get, Post, Body, UseGuards, Put, Param } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { Roles } from '../../auth/decorators/roles.decorator';
import { RolesGuard } from '../../auth/guards/roles.guard';

@Controller('logbook')
export class LogbookController {
  constructor() {}
  @Get('')
  get() {
    
  }
}
