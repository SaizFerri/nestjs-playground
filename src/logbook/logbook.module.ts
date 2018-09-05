import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { LogbookService } from './services/logbook.service';

import { LogbookController } from './controllers/logbook.controller';

import { LogSchema } from './schemas/log.schema';

import { ConfigModule } from '../config/config.module';
import { UserModule } from '../user/user.module';
import { AirportsModule } from '../airports/airports.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Log', schema: LogSchema }]),  
    ConfigModule,
    UserModule,
    AirportsModule
  ],
  controllers: [LogbookController],
  providers: [LogbookService],
  exports: [LogbookService]
})
export class LogbookModule {}
