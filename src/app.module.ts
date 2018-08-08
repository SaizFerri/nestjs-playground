import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule }  from './config/config.module';
import { configService } from './config/services/config.service';
import { AuthModule } from './auth/auth.module';
import { EmailModule } from './email/email.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forRoot(configService.get('DATABASE_URI'), { useNewUrlParser: true }),
    ConfigModule,
    AuthModule,
    EmailModule
  ],
  providers: [],
})
export class AppModule {}
