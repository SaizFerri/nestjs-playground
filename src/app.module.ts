import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule }  from './config/config.module';
import { configService } from './config/services/config.service';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';
import { AppController } from './app.controller';
import { AirportsModule } from './airports/airports.module';
import { LogbookModule } from './logbook/logbook.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot(configService.get('DATABASE_URI'), { useNewUrlParser: true }),
    ConfigModule,
    AuthModule,
    EmailModule,
    AirportsModule,
    LogbookModule
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
