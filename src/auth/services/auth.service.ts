import { Injectable, Inject, forwardRef } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from '../interfaces/jwt-payload.interface'
import { User } from 'user/interfaces/user.interface';
import { ConfigService } from 'config/services/config.service';
import { UserService } from 'user/services/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly config: ConfigService,
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService
  ){}

  async createToken(user: User) {
    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      verified: user.verified,
      roles: user.roles
    };

    const expiresIn = parseInt(this.config.get('EXPIRES_IN'));
    
    return jwt.sign(
      payload, 
      this.config.get('SECRET_KEY'), 
      { expiresIn }
    );
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    return await this.userService.findOneByEmail(payload.email);
  }
}
