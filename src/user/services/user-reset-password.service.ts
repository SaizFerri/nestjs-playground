import { Injectable, UnauthorizedException, BadRequestException, HttpException, HttpStatus } from "@nestjs/common";
import { Model } from 'mongoose';
import { InjectModel } from "@nestjs/mongoose";
import { User } from "../interfaces/user.interface";
import { UserService } from "./user.service";
import { ResetPasswordDto } from "../dtos/reset-password.dto";
import { TokenDto } from "../dtos/token-dto";
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
import * as uuidv4 from 'uuid/v4';
import * as nodemailer from 'nodemailer';
import { ConfigService } from "config/services/config.service";
import { RequestResetPasswordDto } from "../dtos/request-reset-password.dto";

@Injectable()
export class UserResetPasswordService {
  mailTransport: any;

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly userService: UserService,
    private readonly config: ConfigService
  ){
    this.mailTransport = nodemailer.createTransport({
      host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
          user: config.get('EMAIL_USER'),
          pass: config.get('EMAIL_PASS')
        }
    });
  }

  async createResetPasswordToken(params: RequestResetPasswordDto) {
    const email = params.email;
    const user = await this.userService.findOneByEmail(email);
    
    if (user === null || !user.verified) {
      throw new UnauthorizedException();
    }

    const token = uuidv4();
    const date = moment(Date.now()).add(1, 'hours').format();    
    
    try {
      await this.userModel.updateOne({ email: email }, { resetPasswordToken: token, resetPasswordTokenExpiresAt: date });
      const { name } = await this.userService.findOneByEmail(email);
      this.mailTransport.sendMail({
        from: '"[Reset your Password] Skylogbook" <skylogbookapp@gmail.com>',
        to: email,
        subject: 'Reset your password',
        text: '',
        html: `
          <h3>Hi ${name},</h3>
          <p>
            please click the link below to reset your password:
          </p> 
          <a href="${this.config.get('CLIENT_URL')}/resetPassword/${token}">${this.config.get('CLIENT_URL')}/resetPassword/${token}</a> <br>
          <p>Best regards, <br> The Skylogbook Team</p>
        `
      });
    } catch (error) {
      throw new UnauthorizedException();
    }
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