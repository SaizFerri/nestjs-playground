import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigModule } from '../config/config.module';
import { EmailModule } from '../email/email.module';
import { AuthModule } from '../auth/auth.module';

import { UserService } from './services/user.service';
import { UserLoginService } from './services/user-login.service';
import { UserResetPasswordService } from './services/user-reset-password.service';

import { UserSchema } from './schema/user.schema';

import { UserController } from './controllers/user.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),  
    ConfigModule,
    EmailModule,
    forwardRef(() => AuthModule)
  ],
  controllers: [UserController],
  providers: [UserService, UserLoginService, UserResetPasswordService],
  exports: [UserService] 
})
export class UserModule {}
