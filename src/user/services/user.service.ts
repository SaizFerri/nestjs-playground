import { Injectable, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { ConfirmationHashService } from 'auth/services/confirmation-hash.service';
import { ConfigService } from 'config/services/config.service';
import { EmailService } from 'email/services/email.service';

import { ChangeRolesDto } from '../dtos/change-roles.dto';
import { CreateUserDto } from '../dtos/create-user.dto';
import { VerifyHashDto } from '../dtos/verify-hash.dto';
import { EmailDto } from '../dtos/email.dto';

import { User } from '../interfaces/user.interface';

import { RolesEnum } from '../enums/roles.enum';
import { Response } from '../interfaces/response.interface';

import { Model } from 'mongoose';
import { includes } from 'lodash';
import * as bcrypt from 'bcrypt';
import * as EmailValidator from 'email-validator';
import * as moment from 'moment';

@Injectable()
export class UserService {

  constructor(
    @InjectModel('User') private readonly userModel: Model<User>,
    private readonly confirmationHashService: ConfirmationHashService,
    private readonly emailService: EmailService,
    private readonly config: ConfigService
  ){ }

  async findAll(): Promise<User[]> {
    return await this.userModel.find().exec();
  }

  async findOneById(id: String): Promise<User> {
    return await this.userModel.findOne({ _id: id });
  }

  async findOneByEmail(email: String): Promise<User> {
    return await this.userModel.findOne({ email });
  }

  /**
   * Function which takes an id and a role as parameter
   * and adds or deletes the user role.
   * @throws BadRequestException
   * @param params 
   */
  async addRoles(params: ChangeRolesDto): Promise<RolesEnum[]> {
    const user = await this.findOneById(params.id);
    
    if (user === null) {
      throw new UnauthorizedException();
    }

    const userRoles = [...user.roles];
    
    // If role is not in RolesEnum throw bad request exception
    params.roles.forEach((role) => {
      if (!(<any>Object).values(RolesEnum).includes(role) || includes(userRoles, role)) {
        throw new BadRequestException();
      }
    });
    
    userRoles.push(...params.roles);
    
    // If it doesn't have the role, add it
    try {
      await this.userModel.update({ _id: params.id }, { roles: userRoles});
      return userRoles;
    } catch(exception) {
      throw new NotFoundException();
    }
  }

  /**
   * Deletes a Role passed in the params.roles
   * @throws BadRequestException
   * @param params 
   */
  async removeRole(params: ChangeRolesDto): Promise<RolesEnum[]> {
    const user = await this.findOneById(params.id);
    const role = params.roles[0];
    
    if (user === null) {
      throw new UnauthorizedException();
    }

    const userRoles = [...user.roles];

    // If role is not in RolesEnum or the role is "user" throw bad request exception
    if (!(<any>Object).values(RolesEnum).includes(role)
       || params.roles.length > 1 
       || role === RolesEnum.User 
       || !includes(userRoles, role))
    {
      throw new BadRequestException();
    }

    const index = userRoles.indexOf(role, 0);

    if (index > -1) {
      userRoles.splice(index, 1);
    }

    try {
      await this.userModel.update({ _id: params.id }, { roles: userRoles });
      return userRoles;
    } catch(exception) {
      throw new NotFoundException();
    }
  }

  /**
   * Create a user and a confirmation hash to verify the account
   * @param user 
   */
  async createUser(user: CreateUserDto) {
    const { name, email, password, repeatPassword } = user;
    const saltRounds = 10;

    if (!EmailValidator.validate(email) || password !== repeatPassword) {
      throw new BadRequestException({
        success: false,
        error: "Account not created"
      });
    }

    const hash = await bcrypt.hash(password, saltRounds);
    const createdOn = moment.utc(Date.now());
    const userModel = new this.userModel({
      name,
      email,
      password: hash,
      createdOn
    });

    try {
      // Create user and get those fields
      const { _id, name, email } = await this.userModel.create(userModel);
      // Create confirmationHash and get the hash
      const { hash } = await this.confirmationHashService.createHash(_id, email);

      // Email properties
      const from = '"[Verify your account] Skylogbook" <skylogbookapp@gmail.com>';
      const subject = 'Verify your account';
      const html = `
        <h3>Hi ${name},</h3>
        <p>
          please verify your account clicking on this link:
        </p> 
        <a href="${this.config.get('CLIENT_URL')}/verify/${hash}">${this.config.get('CLIENT_URL')}/verify/${hash}</a> <br>
        <p>Best regards, <br> The Skylogbook Team</p>
      `;

      this.emailService.sendMail(from, email, subject, html);

      return {
        success: true,
        message: "User created",
        user: {
          _id,
          name,
          email
        }
      };
      
    } catch(exception) {
      throw new BadRequestException({
        success: false,
        error: "User not created"
      })
    }
  }
  
  /**
   * Function to resend a verification e-mail
   * @param params 
   */
  async resendVerificationEmail(params: EmailDto): Promise<Response> {
    const user = await this.findOneByEmail(params.email);
    
    if (user === null) {
      throw new NotFoundException({
        success: false,
        error: "No user to verify"
      });
    }
    
    const confirmationHash = await this.confirmationHashService.findHashById(user.id);

    const from = '"[Verify your account] Skylogbook" <skylogbookapp@gmail.com>';
    const subject = 'Verify your account';
    const html = `
      <h3>Hi ${user.name},</h3>
      <p>
        please verify your account clicking on this link:
      </p> 
      <a href="${this.config.get('CLIENT_URL')}/verify/${confirmationHash.hash}">${this.config.get('CLIENT_URL')}/verify/${confirmationHash.hash}</a> <br>
      <p>Best regards, <br> The Skylogbook Team</p>
    `;

    this.emailService.sendMail(from, user.email, subject, html);
    
    return {
      success: true,
      message: "Verification e-mail sent",
    }
  }

  /**
   * Verify an account by deleting the hash on the confirmationHash table
   * and updating the user.
   * @param hash 
   */
  async verifyAccount(hash: VerifyHashDto): Promise<any> {
    const confirmationHash = await this.confirmationHashService.findOneByHash(hash.hash);
    const updatedOn = moment.utc(Date.now());

    if (confirmationHash === null) {
      throw new NotFoundException({
        success: false,
        error: "No user to verify"
      });
    }
    const userId = confirmationHash.userId;
    
    try {
      await this.userModel.updateOne({ _id: userId}, { verified: true, roles: [RolesEnum.User], updatedOn });
    } catch (error) {
      throw new UnauthorizedException({
        success: false,
        error: "User not verified"
      });
    }
    
    await this.confirmationHashService.deleteByHash(confirmationHash.hash);

    return {
      success: true,
      message: "Account verified"
    };
  }
}
