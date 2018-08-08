import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";

import { UserService } from "./user.service";
import { ConfigService } from "../../config/services/config.service";
import { EmailService } from "../../email/services/email.service";

import { User } from "../interfaces/user.interface";

import { EmailDto } from "../dtos/email.dto";
import { ResetPasswordDto } from "../dtos/reset-password.dto";

import { Model } from 'mongoose';
import * as jwt from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';

@Injectable()
export class UserResetPasswordService {

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly userService: UserService,
    private readonly config: ConfigService,
    private readonly emailService: EmailService
  ){ }

  /**
   * Function to create the resetPassword token
   * @param params 
   */
  async createResetPasswordToken(params: EmailDto) {
    const email = params.email;
    const user = await this.userService.findOneByEmail(email);
    
    if (user === null || !user.verified) {
      throw new UnauthorizedException({
        success: false,
        error: "Account is not verified, please verify your account"
      });
    }

    // Create the token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      this.config.get('SECRET_KEY'),
      { expiresIn: 3600 }
    );

    const updatedOn = moment.utc(Date.now());
 
    
    try {
      // Update the user in the database with the token
      await this.userModel.updateOne({ email: email }, { updatedOn, resetPasswordToken: token });
      
      const from =  '"[Reset your Password] Skylogbook" <skylogbookapp@gmail.com>';
      const to =  email;
      const subject =  'Reset your password';
      const html = `
        <h3>Hi ${user.name},</h3>
        <p>
          please click the link below to reset your password:
        </p> 
        <a href="${this.config.get('CLIENT_URL')}/resetPassword/${token}">${this.config.get('CLIENT_URL')}/resetPassword/${token}</a> <br>
        <p>Best regards, <br> The Skylogbook Team</p>
      `;

      this.emailService.sendMail(from, to, subject, html);

    } catch (error) {
      throw new UnauthorizedException({
          success: false,
          error: "There was an error generating the token"
        });
    }

    return {
      success: true,
      message: "Token generated and email sent"
    }
  }

  /**
   * Function to actually reset the password
   * @param params 
   */
  async resetPassword(params: ResetPasswordDto) {
    // Verify if the token has expired
    jwt.verify(params.token, this.config.get('SECRET_KEY'), (err, decoded) => {
      if (err) {
        throw new UnauthorizedException({
          success: false,
          error: "Token has expired"
        });
      }
    });

    const user = await this.userModel.findOne({ resetPasswordToken: params.token });
    
    if (user === null) {
      throw new UnauthorizedException({
        success: false,
        error: "User not found"
      });
    }

    const { password, repeatPassword } = params;
    const saltRounds = 10;
    const updatedOn = moment.utc(Date.now());

    if (password === repeatPassword) {
      const hash = await bcrypt.hash(password, saltRounds);
      try {
        await this.userModel.updateOne({ _id: user.id }, { password: hash, updatedOn, resetPasswordToken: null });
      } catch (error) {
        throw new UnauthorizedException({
          success: false,
          error: "Could not update the password"
        });
      }
    } else {
      throw new UnauthorizedException({
        success: false,
        error: "Passwords do not match"
      });
    }

    return {
      success: true,
      message: "Password successfully reseted"
    }
  }
}