import { Module, forwardRef } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { ConfigModule } from 'config/config.module';
import { UserModule } from 'user/user.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfirmationHashSchema } from './schema/confirmation-hash.schema';
import { ConfirmationHashService } from './services/confirmation-hash.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'ConfirmationHash', schema: ConfirmationHashSchema }]),
    ConfigModule, forwardRef(() => UserModule)
  ],
  providers: [AuthService, ConfirmationHashService, JwtStrategy],
  exports: [AuthService, ConfirmationHashService]
})
export class AuthModule {}
