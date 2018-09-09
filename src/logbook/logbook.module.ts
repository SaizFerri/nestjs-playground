import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { LogbookService } from './services/logbook.service';

import { LogbookController } from './controllers/logbook.controller';

import { LogSchema } from './schemas/log.schema';

import { ConfigModule } from '../config/config.module';
import { UserModule } from '../user/user.module';
import { AirportsModule } from '../airports/airports.module';
import { AuthModule } from 'auth/auth.module';
import { HomeBaseController } from './controllers/homebase.controller';
import { HomeBaseService } from './services/homebase.service';
import { HomeBaseSchema } from './schemas/homebase.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Log', schema: LogSchema },
      { name: 'HomeBase', schema: HomeBaseSchema }
    ]),  
    ConfigModule,
    UserModule,
    AirportsModule,
    AuthModule
  ],
  controllers: [LogbookController, HomeBaseController],
  providers: [LogbookService, HomeBaseService],
  exports: [LogbookService, HomeBaseService]
})
export class LogbookModule {}
