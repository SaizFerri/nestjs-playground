import { Module, forwardRef } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schema/user.schema';
import { AuthModule } from 'auth/auth.module';
import { UserLoginService } from './services/user-login.service';
import { UserResetPasswordService } from './services/user-reset-password.service';
import { ConfigModule } from 'config/config.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }]),  
    ConfigModule,
    forwardRef(() => AuthModule)
  ],
  controllers: [UserController],
  providers: [UserService, UserLoginService, UserResetPasswordService],
  exports: [UserService] 
})
export class UserModule {}
