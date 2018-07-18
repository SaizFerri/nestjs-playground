import { Injectable, UnauthorizedException, BadRequestException, HttpException, HttpStatus } from "@nestjs/common";
import { Model } from 'mongoose';
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../interfaces/user.interface";
import { UserService } from "./user.service";
import { ResetPasswordDto } from "../dtos/reset-password.dto";
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import * as uuidv4 from 'uuid/v4';

@Injectable()
export class UserResetPasswordService {
  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly userService: UserService
  ){}

  async createResetPasswordToken(email: string): Promise<string> {
    const user = await this.userService.findOneByEmail(email);
    const saltRounds = 2;

    if (user === null || !user.verified) {
      throw new UnauthorizedException();
    }

    const token = uuidv4();
    const date = moment(Date.now()).add(1, 'hours').format();    
    
    try {
      await this.userModel.updateOne({ email: email }, { resetPasswordToken: token, resetPasswordTokenExpiresAt: date });
    } catch (error) {
      throw new UnauthorizedException();
    }

    return token;
  }

  async resetPassword(token: string, params: ResetPasswordDto) {
    const user = await this.userModel.findOne({ resetPasswordToken: token, resetPasswordTokenExpiresAt: { $gt: Date.now() } });
    
    if (user === null) {
      throw new HttpException('Token expired', HttpStatus.UNAUTHORIZED);
    }

    const { password, verifyPassword } = params;
    const saltRounds = 10;

    if (password === verifyPassword) {
      const hash = await bcrypt.hash(password, saltRounds);
      try {
        await this.userModel.updateOne({ _id: user.id }, { password: hash, resetPasswordToken: null, resetPasswordTokenExpiresAt: null });
      } catch (error) {
        throw new UnauthorizedException();
      }
    } else {
      throw new HttpException('Passwords doesn\'t match', HttpStatus.UNAUTHORIZED);
    }
  }
}