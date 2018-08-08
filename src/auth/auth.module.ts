import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { ConfigModule } from '../config/config.module';
import { UserModule } from '../user/user.module';

import { AuthService } from './services/auth.service';
import { ConfirmationHashService } from './services/confirmation-hash.service';

import { JwtStrategy } from './strategies/jwt.strategy';

import { ConfirmationHashSchema } from './schema/confirmation-hash.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ConfirmationHash', schema: ConfirmationHashSchema }]),
    ConfigModule, forwardRef(() => UserModule)
  ],
  providers: [AuthService, ConfirmationHashService, JwtStrategy],
  exports: [AuthService, ConfirmationHashService]
})
export class AuthModule {}
