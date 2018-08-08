import { Injectable, Inject, forwardRef, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { AuthService } from "../../auth/services/auth.service";

import { User } from "../interfaces/user.interface";

import { UserLoginDto } from '../dtos/user-login.dto';
import { TokenDto } from '../dtos/token-dto';

import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserLoginService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService
  ){}

  async login(user: UserLoginDto): Promise<TokenDto> {
    const userToLogin = await this.userModel.findOne({email: user.email});
    
    if (!userToLogin) {
      throw new UnauthorizedException({
        error: 'Email or password incorrect'
      });
    }

    const canLogIn = await bcrypt.compare(user.password, userToLogin.password);
    
    if (!canLogIn) {
      throw new UnauthorizedException({
        error: 'Email or password incorrect'
      });
    }

    const token = await this.authService.createToken(userToLogin);

    const response = new TokenDto();
    response.token = token;

    return response;
  }
}