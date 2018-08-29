import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigModule } from '../config/config.module';

import { AirportSchema } from './schemas/airport.schema';

import { AirportService } from './services/airport.service';

import { AirportController } from './controllers/airport.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Airport', schema: AirportSchema }]),  
    ConfigModule
  ],
  controllers: [AirportController],
  providers: [AirportService],
  exports: [AirportService] 
})
export class AirportsModule {}
