import { Model } from 'mongoose';
import { Injectable, Inject, forwardRef, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { AuthService } from "auth/services/auth.service";
import { User } from "../interfaces/user.interface";
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserLoginService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    @Inject(forwardRef(() => AuthService))
    private readonly authService: AuthService
  ){}

  async login(user: User): Promise<String> {
    const userToLogin = await this.userModel.findOne({email: user.email});
    
    if (!userToLogin) {
      throw new UnauthorizedException();
    }

    const canLogIn = await bcrypt.compare(user.password, userToLogin.password);
    
    if (!canLogIn) {
      throw new UnauthorizedException();
    }

    return await this.authService.createToken(userToLogin);
  }
}